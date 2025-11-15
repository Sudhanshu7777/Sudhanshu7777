# EcoSort Assist Backend API

A comprehensive Express.js backend API for EcoSort Assist - a waste management and recycling platform.

## Features

- 🌱 **Express.js Server** with comprehensive middleware setup
- 🗄️ **SQLite Database** with Knex.js ORM
- 📍 **Location-based Services** with Haversine distance calculation
- 🔒 **Security Features** including CORS, helmet, and rate limiting
- 📊 **Complete CRUD Operations** for all entities
- 🚀 **Modular Architecture** with separated routes, controllers, and models

## Database Schema

### Tables

1. **dustbins** - Waste collection points
   - id, name, latitude, longitude, waste_category, contact_number, opening_hours, created_at

2. **recycling_plants** - Recycling facilities
   - id, name, latitude, longitude, accepted_categories, contact, hours, uses_green_energy, created_at

3. **agencies** - Waste management authorities
   - id, name, waste_type, contact_number, email, jurisdiction, created_at

4. **complaints** - User-reported issues
   - id, user_name, issue_category, latitude, longitude, photo_url, description, tracking_id, status, created_at

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository and navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run database migrations:
```bash
npm run migrate
```

5. Seed the database with sample data:
```bash
npm run seed
```

6. Start the development server:
```bash
npm run dev
```

Or for production:
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Dustbins
- `GET /api/dustbins` - Get all dustbins
- `GET /api/dustbins/:id` - Get dustbin by ID
- `GET /api/dustbins/nearby?lat=&lng=&radius=` - Get nearby dustbins
- `GET /api/dustbins/category/:category` - Get dustbins by waste category
- `POST /api/dustbins` - Create new dustbin
- `PUT /api/dustbins/:id` - Update dustbin
- `DELETE /api/dustbins/:id` - Delete dustbin

### Example Requests

#### Get nearby dustbins
```bash
curl "http://localhost:3000/api/dustbins/nearby?latitude=40.7580&longitude=-73.9855&radius=2"
```

#### Get dustbins by category
```bash
curl "http://localhost:3000/api/dustbins/category/recyclable"
```

#### Create new dustbin
```bash
curl -X POST "http://localhost:3000/api/dustbins" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Dustbin",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "waste_category": "mixed",
    "contact_number": "+1-212-555-0000",
    "opening_hours": "24/7"
  }'
```

## Project Structure

```
backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── dustbinController.js # Dustbin logic
│   └── healthController.js  # Health check logic
├── models/
│   ├── Dustbin.js          # Dustbin model
│   ├── RecyclingPlant.js   # Recycling plant model
│   ├── Agency.js           # Agency model
│   └── Complaint.js        # Complaint model
├── routes/
│   ├── dustbins.js         # Dustbin routes
│   └── health.js           # Health check routes
├── utils/
│   └── distance.js         # Distance calculation utilities
├── migrations/             # Database migration files
├── seeds/                  # Database seed files
├── database/               # SQLite database files
├── server.js               # Main server file
├── knexfile.js            # Knex configuration
├── package.json
├── .env.example
└── README.md
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `DB_PATH` - SQLite database file path
- `JWT_SECRET` - JWT secret key
- `CORS_ORIGIN` - Allowed CORS origin
- `RATE_LIMIT_WINDOW_MS` - Rate limiting window
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window

## Database Management

### Create new migration
```bash
knex migrate:make migration_name
```

### Run migrations
```bash
npm run migrate
```

### Rollback migrations
```bash
npm run migrate:rollback
```

### Seed database
```bash
npm run seed
```

## Features Implemented

✅ Express.js server with middleware setup
✅ SQLite database with Knex.js ORM
✅ Complete database schema with all required tables
✅ Migration scripts for database initialization
✅ Environment configuration with .env.example
✅ Database seeding with sample data (10 dustbins, 3 plants, 2 agencies)
✅ Distance calculation utilities (Haversine formula)
✅ Request logging and error handling
✅ Health check endpoint
✅ Modular and scalable project structure
✅ Security features (CORS, helmet, rate limiting)
✅ Comprehensive API endpoints with full CRUD operations

## Testing the Distance Calculation

The distance calculation utility has been tested with real NYC coordinates:

```bash
# Test nearby functionality from Times Square
curl "http://localhost:3000/api/dustbins/nearby?latitude=40.7580&longitude=-73.9855&radius=2"
```

This returns dustbins within 2km of Times Square, sorted by distance.

## License

ISC