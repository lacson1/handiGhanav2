# Create Demo Users

## Automatic Method

Run the seed script when your database is available:

```bash
cd backend
npx tsx prisma/seed-users.ts
```

## Manual Method (Using API)

If you prefer to create users via API, use these curl commands:

### 1. Create Customer Demo User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@test.com",
    "password": "password123",
    "name": "John Doe",
    "phone": "+233241111111",
    "role": "CUSTOMER"
  }'
```

### 2. Create Provider Demo User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "provider@test.com",
    "password": "password123",
    "name": "Bis FagQ",
    "phone": "+233241234567",
    "role": "PROVIDER"
  }'
```

### 3. Create Admin Demo User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123",
    "name": "Admin User",
    "phone": "+233241111999",
    "role": "ADMIN"
  }'
```

## Demo Credentials

After creation, you can login with:

- **Customer**: `customer@test.com` / `password123`
- **Provider**: `provider@test.com` / `password123`
- **Admin**: `admin@test.com` / `admin123`

## Using the Hidden Demo Login

On any login page:
1. Click **5 times rapidly** on the "Sign In" title area
2. Demo login buttons will appear
3. Click your desired role to instantly login

