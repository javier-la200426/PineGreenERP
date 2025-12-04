"""
Flask API Server for Route Optimization
Provides REST API endpoints for the frontend to optimize delivery routes
"""

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from route_optimizer import optimize_routes, geocode_addresses

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Configuration
GOOGLE_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY')

if not GOOGLE_API_KEY:
    print("WARNING: GOOGLE_MAPS_API_KEY not found in environment variables")


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'route-optimizer',
        'version': '1.0.0'
    })


@app.route('/api/geocode', methods=['POST'])
def geocode():
    """
    Geocode addresses to coordinates

    Request body:
    {
        "addresses": ["123 Main St, Boston, MA", "456 Oak Ave, Cambridge, MA"]
    }

    Response:
    {
        "success": true,
        "coordinates": [
            {"address": "123 Main St, Boston, MA", "lat": 42.123, "lng": -71.456},
            {"address": "456 Oak Ave, Cambridge, MA", "lat": 42.234, "lng": -71.567}
        ]
    }
    """
    try:
        data = request.get_json()

        if not data or 'addresses' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing addresses in request body'
            }), 400

        addresses = data['addresses']

        if not isinstance(addresses, list) or len(addresses) == 0:
            return jsonify({
                'success': False,
                'error': 'Addresses must be a non-empty list'
            }), 400

        # Geocode addresses
        coords = geocode_addresses(addresses, GOOGLE_API_KEY)

        # Format response
        result = []
        for i, (lat, lng) in enumerate(coords):
            result.append({
                'address': addresses[i],
                'lat': lat,
                'lng': lng,
                'success': lat is not None and lng is not None
            })

        return jsonify({
            'success': True,
            'coordinates': result
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/optimize-routes', methods=['POST'])
def optimize_routes_endpoint():
    """
    Optimize routes for given jobs and workers

    Request body:
    {
        "jobs": [
            {
                "id": "job-1",
                "address": "123 Main St, Boston, MA",
                "latitude": 42.123,  // optional if address provided
                "longitude": -71.456  // optional if address provided
            }
        ],
        "workers": [
            {
                "id": "worker-1",
                "name": "John Doe",
                "depot_address": "1 City Hall Square, Boston, MA",
                "depot_lat": 42.123,  // optional if depot_address provided
                "depot_lng": -71.456  // optional if depot_address provided
            }
        ]
    }

    Response:
    {
        "success": true,
        "routes": {
            "worker-1": {
                "worker_id": "worker-1",
                "worker_name": "John Doe",
                "jobs": [
                    {
                        "job_id": "job-1",
                        "order": 1,
                        "location": [42.123, -71.456]
                    }
                ],
                "total_duration_seconds": 1800,
                "total_distance_meters": 15000,
                "optimized_path": [[42.123, -71.456], [42.234, -71.567]]
            }
        }
    }
    """
    try:
        data = request.get_json()

        # Validate request
        if not data:
            return jsonify({
                'success': False,
                'error': 'Request body is required'
            }), 400

        if 'jobs' not in data or 'workers' not in data:
            return jsonify({
                'success': False,
                'error': 'Both jobs and workers are required'
            }), 400

        jobs = data['jobs']
        workers = data['workers']

        if len(jobs) == 0:
            return jsonify({
                'success': False,
                'error': 'At least one job is required'
            }), 400

        if len(workers) == 0:
            return jsonify({
                'success': False,
                'error': 'At least one worker is required'
            }), 400

        if not GOOGLE_API_KEY:
            return jsonify({
                'success': False,
                'error': 'Google Maps API key not configured'
            }), 500

        # Optimize routes
        optimization_result = optimize_routes(jobs, workers, GOOGLE_API_KEY)
        routes = optimization_result['routes']
        warnings = optimization_result.get('warnings', [])

        return jsonify({
            'success': True,
            'routes': routes,
            'warnings': warnings,
            'metadata': {
                'num_jobs': len(jobs),
                'num_workers': len(workers),
                'timestamp': None  # Could add timestamp if needed
            }
        })

    except ValueError as e:
        return jsonify({
            'success': False,
            'error': f'Validation error: {str(e)}'
        }), 400

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    debug = os.getenv('FLASK_ENV') == 'development'

    print(f"Starting Route Optimization API on port {port}")
    print(f"Debug mode: {debug}")

    app.run(host='0.0.0.0', port=port, debug=debug)
