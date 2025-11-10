# HandyGhana v2 - Service Marketplace

A modern, Ghana-centric service marketplace platform that connects users with trusted local service providers. Built with React, TypeScript, Node.js, and PostgreSQL.

## 🎯 Features

### Core Features
- **Provider Directory**: Browse and filter service providers by category, location, rating, and availability
- **Quick Booking**: Instant booking with date/time selection
- **Provider Profiles**: Detailed profiles with reviews, skills, and service areas
- **Provider Dashboard**: Complete dashboard for providers to manage bookings, profile, and analytics
- **Admin Dashboard**: Full admin panel for managing providers, users, and bookings
- **Real-time Contact**: WhatsApp and phone integration
- **Authentication**: JWT-based auth with protected routes
- **Dark/Light Mode**: Beautiful UI with theme switching
- **Responsive Design**: Works seamlessly on all devices
- **Verified Providers**: Trust badge system for verified professionals

### Advanced Features
- **Payment Integration**: Paystack integration for secure booking payments
- **Image Upload**: Cloudinary integration for profile photos
- **Real-time Updates**: WebSocket support for instant booking notifications
- **Email Notifications**: Automated email confirmations for bookings
- **API Integration**: Full REST API with TypeScript support

## 🧱 Tech Stack

### Frontend
- React 19 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion (animations)
- React Router
- TanStack Query
- React Hook Form + Zod

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcryptjs

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- (Optional) Docker & Docker Compose

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd handiGhanav2
```

2. **Set up the frontend**
```bash
cd frontend
npm install
npm run dev
```

3. **Set up the backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

4. **Set up PostgreSQL with Docker (optional)**
```bash
docker-compose up -d
```

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/handyghana?schema=public"
PORT=3001
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key
```

## 📁 Project Structure

```
handiGhanav2/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── context/       # React context providers
│   │   ├── lib/           # Utility functions
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Helper functions
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   └── utils/         # Utility functions
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── package.json
└── docker-compose.yml
```

## 🎨 Design Guidelines

- **Color Scheme**: White background, gold accent (#FACC15), black/gray text
- **Typography**: Inter / Poppins
- **Components**: Rounded-xl, subtle shadows, hover effects
- **Animations**: Framer Motion with 250-400ms duration

## 🌍 Localization

- Default language: English (en-GH)
- Currency: Ghana Cedi (GHS)
- Cities: Accra, Kumasi, Cape Coast, Takoradi, Tema, and more

## 📝 API Endpoints

### Providers
- `GET /api/providers` - Get all providers (with filters)
- `GET /api/providers/:id` - Get provider by ID
- `POST /api/providers` - Create provider (protected)
- `PUT /api/providers/:id` - Update provider (protected)

### Bookings
- `GET /api/bookings` - Get bookings
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id/status` - Update booking status

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Upload
- `POST /api/upload/image` - Upload image to Cloudinary (protected)

### Payments
- `POST /api/payments/initialize` - Initialize Paystack payment
- `GET /api/payments/verify/:reference` - Verify payment status

## 🎛️ Provider Dashboard

The Provider Dashboard (`/dashboard`) includes:

- **Overview Tab**: Key metrics (total bookings, completion rate, ratings, monthly stats)
- **Bookings Tab**: Manage all bookings (pending, confirmed, completed)
- **Analytics Tab**: Performance metrics and revenue tracking
- **Profile Tab**: Edit provider profile, update information, upload photos

### Accessing the Dashboard

1. Click "Sign In" in the navbar
2. Use any email/password (demo mode)
3. You'll be logged in as a provider
4. Click "Dashboard" to access the provider dashboard

## 🔧 Configuration

### Environment Variables

**Frontend** (`.env`):
```env
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
```

**Backend** (`.env`):
```env
DATABASE_URL=postgresql://user:password@localhost:5432/handyghana
PORT=3001
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
PAYSTACK_SECRET_KEY=sk_test_your_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FRONTEND_URL=http://localhost:5173
```

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel
```

### Backend (Render/Railway)
```bash
cd backend
npm run build
# Deploy to Render or Railway
# Make sure to set all environment variables
```

## 📦 New Features Added

### 1. **Backend API Integration**
- Full REST API with TypeScript
- API client library in frontend
- Error handling and fallbacks
- Mock data fallback for development

### 2. **Image Upload (Cloudinary)**
- Profile photo uploads
- Automatic image optimization
- Secure file handling

### 3. **Payment Integration (Paystack)**
- Secure payment processing
- Payment modal with card form
- Payment verification
- Booking confirmation after payment

### 4. **Email Notifications**
- Booking confirmation emails
- Provider notification emails
- HTML email templates
- SMTP configuration support

### 5. **WebSocket Real-time Updates**
- Real-time booking notifications
- Live status updates
- Provider and user rooms
- Socket.io integration

### 6. **Admin Dashboard**
- Provider verification system
- User management
- Booking oversight
- Analytics and statistics
- Search and filtering

## 📄 License

ISC

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

