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
- `GET /api/auth/google` - Initiate Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback (handled automatically)

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
- `FRONTEND_URL` - Frontend URL for OAuth redirects (default: http://localhost:5173)
- `SESSION_SECRET` - Secret for session management (used for OAuth)

### Google OAuth (Optional)

To enable Google login, add these variables:

- `GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret
- `GOOGLE_CALLBACK_URL` - Google OAuth callback URL (default: http://localhost:3001/api/auth/google/callback)

**Setting up Google OAuth:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - Development: `http://localhost:3001/api/auth/google/callback`
   - Production: `https://yourdomain.com/api/auth/google/callback`
7. Copy the Client ID and Client Secret to your `.env` file

The Google login button will automatically appear on the sign-in page once these credentials are configured.

**📖 For detailed setup instructions, see [GOOGLE_OAUTH_SETUP.md](../GOOGLE_OAUTH_SETUP.md)**

