# Route Optimization API

Flask backend service for optimizing delivery routes using Google Maps API and OR-Tools.

## Features

- Multi-vehicle route optimization (VRP)
- Traffic-aware routing using real-time Google Maps data
- Balanced workload distribution across drivers
- RESTful API for frontend integration

## Setup

### 1. Install Dependencies

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and add your Google Maps API key:

```bash
cp .env.example .env
```

Edit `.env` and set:
```
GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

**Get a Google Maps API Key:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable these APIs:
   - Maps JavaScript API
   - Geocoding API
   - Distance Matrix API
4. Create credentials (API Key)
5. Copy the key to your `.env` file

### 3. Run the Server

```bash
python app.py
```

The API will start on `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /health
```

### Geocode Addresses
```
POST /api/geocode
Content-Type: application/json

{
  "addresses": ["123 Main St, Boston, MA"]
}
```

### Optimize Routes
```
POST /api/optimize-routes
Content-Type: application/json

{
  "jobs": [
    {
      "id": "job-1",
      "address": "123 Main St, Boston, MA"
    }
  ],
  "workers": [
    {
      "id": "worker-1",
      "name": "John Doe",
      "depot_address": "1 City Hall Square, Boston, MA"
    }
  ]
}
```

## Deployment

### Using Gunicorn (Production)

```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Docker (Optional)

```bash
docker build -t route-optimizer .
docker run -p 5000:5000 --env-file .env route-optimizer
```

## Notes

- Google Maps API has rate limits and usage costs
- Distance Matrix API: $5 per 1,000 elements (origins × destinations)
- Consider caching results for frequently used routes
- Time limit for optimization is 5 seconds (configurable in route_optimizer.py)
