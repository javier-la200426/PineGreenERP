"""
Route Optimization Module
Ported from filesForReference/app.py
Uses Google Maps API and OR-Tools for Vehicle Routing Problem (VRP) solving
"""

import math
import googlemaps
from ortools.constraint_solver import pywrapcp, routing_enums_pb2


def geocode_addresses(address_list, api_key):
    """
    Convert addresses to GPS coordinates using Google Maps Geocoding API

    Args:
        address_list: List of address strings
        api_key: Google Maps API key

    Returns:
        List of (lat, lng) tuples
    """
    gmaps = googlemaps.Client(key=api_key)
    coords = []
    for address in address_list:
        try:
            result = gmaps.geocode(address)
            if result:
                loc = result[0]["geometry"]["location"]
                coords.append((loc["lat"], loc["lng"]))
            else:
                coords.append((None, None))
        except Exception as e:
            print(f"Error geocoding {address}: {e}")
            coords.append((None, None))
    return coords


def google_distance_matrix(locations, api_key, max_elements=100):
    """
    Build FULL NxN distance AND duration matrices using Google Maps.
    Falls back gracefully if traffic data is not available.

    Args:
        locations: List of (lat, lng) tuples
        api_key: Google Maps API key
        max_elements: Maximum API elements per request (default 100)

    Returns:
        Tuple of (duration_matrix, distance_matrix)
        - duration_matrix: NxN matrix of durations in seconds
        - distance_matrix: NxN matrix of distances in meters
    """
    gmaps = googlemaps.Client(key=api_key)

    N = len(locations)
    duration_matrix = [[0] * N for _ in range(N)]
    distance_matrix = [[0] * N for _ in range(N)]

    # Convert to strings for API
    loc_strings = [f"{lat},{lng}" for (lat, lng) in locations]

    # Determine chunk size to respect API limits
    chunk = max(1, int(math.floor(max_elements ** 0.5)))  # e.g., sqrt(100) = 10

    print(f"[DEBUG] Building distance matrix for {N} locations...")

    for i_start in range(0, N, chunk):
        for j_start in range(0, N, chunk):
            origins = loc_strings[i_start:i_start + chunk]
            destinations = loc_strings[j_start:j_start + chunk]

            try:
                # Try with traffic data first
                response = gmaps.distance_matrix(
                    origins=origins,
                    destinations=destinations,
                    mode="driving",
                    departure_time="now",
                    traffic_model="best_guess"
                )

                # Fill the matrices
                for i, row in enumerate(response["rows"]):
                    for j, element in enumerate(row["elements"]):
                        if element["status"] == "OK":
                            # Get duration - prefer traffic-aware, fallback to regular
                            if "duration_in_traffic" in element:
                                duration_matrix[i_start + i][j_start + j] = element["duration_in_traffic"]["value"]
                            else:
                                duration_matrix[i_start + i][j_start + j] = element["duration"]["value"]
                            
                            # Get distance in meters
                            distance_matrix[i_start + i][j_start + j] = element["distance"]["value"]
                        else:
                            print(f"[WARN] Route not available: {element['status']}")
                            duration_matrix[i_start + i][j_start + j] = 999999
                            distance_matrix[i_start + i][j_start + j] = 999999

            except KeyError as e:
                print(f"[WARN] Traffic data not available ({e}), trying without traffic...")
                # Retry without traffic parameters
                try:
                    response = gmaps.distance_matrix(
                        origins=origins,
                        destinations=destinations,
                        mode="driving"
                    )
                    for i, row in enumerate(response["rows"]):
                        for j, element in enumerate(row["elements"]):
                            if element["status"] == "OK":
                                duration_matrix[i_start + i][j_start + j] = element["duration"]["value"]
                                distance_matrix[i_start + i][j_start + j] = element["distance"]["value"]
                            else:
                                duration_matrix[i_start + i][j_start + j] = 999999
                                distance_matrix[i_start + i][j_start + j] = 999999
                except Exception as e2:
                    print(f"[ERROR] Distance matrix API failed: {e2}")
                    for i in range(len(origins)):
                        for j in range(len(destinations)):
                            duration_matrix[i_start + i][j_start + j] = 999999
                            distance_matrix[i_start + i][j_start + j] = 999999

            except Exception as e:
                print(f"[ERROR] Distance matrix chunk error: {e}")
                for i in range(len(origins)):
                    for j in range(len(destinations)):
                        duration_matrix[i_start + i][j_start + j] = 999999
                        distance_matrix[i_start + i][j_start + j] = 999999

    # Log sample distances for debugging
    if N > 1:
        print(f"[DEBUG] Sample duration [0][1]: {duration_matrix[0][1]} seconds ({duration_matrix[0][1]/60:.1f} min)")
        print(f"[DEBUG] Sample distance [0][1]: {distance_matrix[0][1]} meters ({distance_matrix[0][1]/1000:.1f} km)")

    return duration_matrix, distance_matrix


def solve_vrp(depot_coords, job_coords, api_key, time_limit_seconds=5):
    """
    Balanced multi-vehicle VRP solver:
    - Google Maps traffic-aware distances
    - Balanced routes using "minimize the max route distance"
    - Multiple depots (one per driver)

    Args:
        depot_coords: List of (lat, lng) tuples for each driver's starting location
        job_coords: List of (lat, lng) tuples for job locations
        api_key: Google Maps API key
        time_limit_seconds: Solver time limit (default 5 seconds)

    Returns:
        Tuple of (routes_dict, all_locations)
        - routes_dict: {driver_id: route_data}
        - all_locations: Combined list of all locations (depots + jobs)
    """
    all_locations = depot_coords + job_coords
    num_drivers = len(depot_coords)
    num_jobs = len(job_coords)

    print(f"[DEBUG] Solving VRP: {num_drivers} drivers, {num_jobs} jobs")

    # Build distance matrices (duration for optimization, distance for reporting)
    duration_matrix, distance_matrix = google_distance_matrix(all_locations, api_key)

    # Create routing index manager
    manager = pywrapcp.RoutingIndexManager(
        len(duration_matrix),
        num_drivers,
        list(range(num_drivers)),  # Start nodes (one per driver)
        list(range(num_drivers))   # End nodes (return to depot)
    )

    routing = pywrapcp.RoutingModel(manager)

    # Duration callback (optimize based on travel time)
    def duration_callback(from_idx, to_idx):
        f = manager.IndexToNode(from_idx)
        t = manager.IndexToNode(to_idx)
        return duration_matrix[f][t]

    transit_idx = routing.RegisterTransitCallback(duration_callback)
    routing.SetArcCostEvaluatorOfAllVehicles(transit_idx)

    # Add duration dimension
    routing.AddDimension(
        transit_idx,
        0,          # no slack
        99999999,   # max route duration allowed (very large)
        True,       # start cumul at zero
        "Duration"
    )

    duration_dimension = routing.GetDimensionOrDie("Duration")

    # KEY: Minimize the MAXIMUM duration across all drivers (balanced workload)
    distance_dimension_coefficient = 100
    duration_dimension.SetGlobalSpanCostCoefficient(distance_dimension_coefficient)
    print(f"[DEBUG] Balance coefficient: {distance_dimension_coefficient}")

    # Search parameters
    params = pywrapcp.DefaultRoutingSearchParameters()
    params.first_solution_strategy = routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
    params.local_search_metaheuristic = routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
    params.time_limit.FromSeconds(time_limit_seconds)

    # Solve
    print(f"[DEBUG] Running solver with {time_limit_seconds}s time limit...")
    solution = routing.SolveWithParameters(params)

    if solution is None:
        raise Exception("No solution found. Try reducing number of jobs or increasing number of drivers.")

    print("[DEBUG] Solution found! Extracting routes...")

    # Extract routes with proper distance and duration
    routes = {}
    for v in range(num_drivers):
        idx = routing.Start(v)
        path_nodes = []
        route_duration = 0
        route_distance = 0

        while not routing.IsEnd(idx):
            node = manager.IndexToNode(idx)
            path_nodes.append(node)
            previous_idx = idx
            idx = solution.Value(routing.NextVar(idx))
            
            # Get actual values from matrices
            from_node = manager.IndexToNode(previous_idx)
            to_node = manager.IndexToNode(idx)
            route_duration += duration_matrix[from_node][to_node]
            route_distance += distance_matrix[from_node][to_node]

        # Add final node
        path_nodes.append(manager.IndexToNode(idx))

        # Count actual jobs (exclude depot nodes)
        job_count = len([n for n in path_nodes if n >= num_drivers])

        routes[f"driver_{v}"] = {
            "path": path_nodes,
            "duration_seconds": route_duration,
            "distance_meters": route_distance,
            "job_count": job_count
        }

        print(f"[DEBUG] Driver {v}: {job_count} jobs, {route_distance/1000:.1f} km, {route_duration/60:.0f} min")

    return routes, all_locations


def optimize_routes(jobs, workers, api_key):
    """
    Main function to optimize routes for given jobs and workers

    Args:
        jobs: List of job dicts with 'id', 'address', 'latitude', 'longitude'
        workers: List of worker dicts with 'id', 'name', 'depot_address' or 'depot_lat'/'depot_lng'
        api_key: Google Maps API key

    Returns:
        Dict with optimized routes for each worker
    """
    print(f"\n{'='*60}")
    print(f"[OPTIMIZE] Starting route optimization")
    print(f"[OPTIMIZE] Workers: {len(workers)}, Jobs: {len(jobs)}")
    print(f"{'='*60}")

    # Prepare depot coordinates (one per worker)
    depot_coords = []
    for i, worker in enumerate(workers):
        if 'depot_lat' in worker and 'depot_lng' in worker and worker['depot_lat'] and worker['depot_lng']:
            depot_coords.append((float(worker['depot_lat']), float(worker['depot_lng'])))
            print(f"[OPTIMIZE] Worker {i} ({worker.get('name', 'Unknown')}): Using provided depot coords")
        elif 'depot_address' in worker and worker['depot_address']:
            # Geocode depot address
            print(f"[OPTIMIZE] Worker {i} ({worker.get('name', 'Unknown')}): Geocoding depot '{worker['depot_address']}'")
            coords = geocode_addresses([worker['depot_address']], api_key)
            if coords[0][0] is None:
                raise ValueError(f"Could not geocode depot for worker {worker['id']}")
            depot_coords.append(coords[0])
        else:
            # Default to Boston City Hall
            default_depot = (42.3601, -71.0589)
            print(f"[OPTIMIZE] Worker {i} ({worker.get('name', 'Unknown')}): Using default depot (Boston City Hall)")
            depot_coords.append(default_depot)

    # Prepare job coordinates
    job_coords = []
    for i, job in enumerate(jobs):
        if 'latitude' in job and 'longitude' in job and job['latitude'] and job['longitude']:
            job_coords.append((float(job['latitude']), float(job['longitude'])))
        elif 'address' in job and job['address']:
            # Geocode job address
            print(f"[OPTIMIZE] Job {i}: Geocoding '{job['address']}'")
            coords = geocode_addresses([job['address']], api_key)
            if coords[0][0] is None:
                raise ValueError(f"Could not geocode job {job['id']}")
            job_coords.append(coords[0])
        else:
            raise ValueError(f"Job {job['id']} missing location")

    print(f"[OPTIMIZE] All coordinates prepared. Running VRP solver...")

    # Check for jobs that are far from depot (>200km as the crow flies)
    def haversine_km(coord1, coord2):
        """Calculate distance between two lat/lng points in km"""
        from math import radians, sin, cos, sqrt, atan2
        lat1, lon1 = radians(coord1[0]), radians(coord1[1])
        lat2, lon2 = radians(coord2[0]), radians(coord2[1])
        dlat, dlon = lat2 - lat1, lon2 - lon1
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        return 6371 * 2 * atan2(sqrt(a), sqrt(1-a))

    # Use first depot as reference point
    reference_depot = depot_coords[0]
    far_jobs = []
    for i, job_coord in enumerate(job_coords):
        dist_km = haversine_km(reference_depot, job_coord)
        if dist_km > 200:  # 200km threshold
            far_jobs.append({
                'index': i,
                'job': jobs[i],
                'distance_km': dist_km
            })

    if far_jobs:
        print(f"\n[WARNING] {len(far_jobs)} job(s) are >200km from depot:")
        for fj in far_jobs:
            print(f"  - {fj['job'].get('address', 'Unknown')}: {fj['distance_km']:.0f} km away")
        print(f"[WARNING] Consider setting worker depot addresses closer to jobs, or jobs may cluster to one driver.\n")

    # Solve VRP
    routes, all_locations = solve_vrp(depot_coords, job_coords, api_key)

    # Map routes back to job IDs
    result = {}
    total_jobs_assigned = 0
    
    for driver_key, route_data in routes.items():
        driver_idx = int(driver_key.split('_')[1])
        worker = workers[driver_idx]

        # Extract job assignments (skip depot nodes)
        job_assignments = []
        for node_idx in route_data['path']:
            # Depot nodes are 0 to num_workers-1
            if node_idx >= len(workers):
                job_idx = node_idx - len(workers)
                job = jobs[job_idx]
                job_assignments.append({
                    'job_id': job['id'],
                    'order': len(job_assignments) + 1,
                    'location': all_locations[node_idx]
                })

        total_jobs_assigned += len(job_assignments)

        result[worker['id']] = {
            'worker_id': worker['id'],
            'worker_name': worker.get('name', 'Unknown'),
            'jobs': job_assignments,
            'total_duration_seconds': route_data['duration_seconds'],
            'total_distance_meters': route_data['distance_meters'],
            'optimized_path': [all_locations[idx] for idx in route_data['path']]
        }

        print(f"[RESULT] {worker.get('name', 'Unknown')}: {len(job_assignments)} jobs, "
              f"{route_data['distance_meters']/1000:.1f} km, {route_data['duration_seconds']/60:.0f} min")

    print(f"\n[SUMMARY] Total jobs assigned: {total_jobs_assigned}/{len(jobs)}")
    print(f"{'='*60}\n")

    # Build warnings list for frontend
    warnings = []
    if far_jobs:
        warnings.append({
            'type': 'far_jobs',
            'message': f"{len(far_jobs)} job(s) are more than 200km from the depot. Consider updating worker depot addresses.",
            'details': [f"{fj['job'].get('address', 'Unknown')}: {fj['distance_km']:.0f} km away" for fj in far_jobs]
        })

    return {'routes': result, 'warnings': warnings}
