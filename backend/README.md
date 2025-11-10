# HandyGhana Backend

Node.js + Express + Prisma backend API for the HandyGhana service marketplace.

## 🚀 Quick Start

1. **Install dependencies**
```bash
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. **Set up database**
```bash
npm run prisma:generate
npm run prisma:migrate
```

4. **Start development server**
```bash
npm run dev
```

Server runs on `http://localhost:3001`

## 📦 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## 🗄️ Database

The project uses PostgreSQL with Prisma ORM. Make sure PostgreSQL is running before starting the server.

### Using Docker
```bash
docker-compose up -d
```

### Manual Setup
1. Install PostgreSQL
2. Create a database named `handyghana`
3. Update `DATABASE_URL` in `.env`

## 📡 API Endpoints

### Health Check
- `GET /health` - Server health status

### Providers
- `GET /api/providers` - List all providers (with query filters)
- `GET /api/providers/:id` - Get provider by ID
- `POST /api/providers` - Create provider (protected)
- `PUT /api/providers/:id` - Update provider (protected)

### Bookings
- `GET /api/bookings` - List bookings
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id/status` - Update booking status

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile (protected)

## 🔐 Authentication

JWT-based authentication. Include token in Authorization header:
```
Authorization: Bearer <token>
```

## 🏗️ Project Structure

```
src/
├── routes/         # API route definitions
│   ├── providers.ts
│   ├── bookings.ts
│   └── auth.ts
├── controllers/    # Route handlers
│   ├── providerController.ts
│   ├── bookingController.ts
│   └── authController.ts
├── middleware/     # Express middleware
├── utils/          # Utility functions
└── server.ts       # Main server file
```

## 📝 Environment Variables

Required environment variables (see `.env.example`):

- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 3001)
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)

