# 📊 Seeding Providers from CSV Guide

## Overview
This guide will help you import service providers from a CSV file into the HandyGhana database.

## Prerequisites
- `service_providers.csv` file in the project root
- Backend deployed and database connected

## CSV File Format

Your `service_providers.csv` should have the following columns:

### Required Columns:
- `name` - Provider name (string)
- `category` - Service category (string)
- `location` - Provider location (string)
- `phone` - Contact phone number (string)

### Optional Columns:
- `whatsapp` - WhatsApp number (defaults to phone)
- `email` - Email address (auto-generated if missing)
- `description` - Service description (string)
- `bio` - Provider biography (string)
- `rating` - Initial rating (number, default: 4.5)
- `verified` - Verification status (true/false, default: random)
- `availability` - Availability status (string, default: "Available Now")
- `hourlyRate` - Hourly rate in GHS (number, default: 50)
- `experience` - Years of experience (number, default: 5)
- `skills` - Comma-separated skills (string)
- `certifications` - Comma-separated certifications (string)

### Example CSV:
```csv
name,category,location,phone,email,description,rating,verified,hourlyRate,experience,skills
John Doe,Plumber,Accra,+233 24 123 4567,john@example.com,Expert plumber,4.8,true,75,10,"Pipe repair, Installation, Drainage"
Jane Smith,Electrician,Kumasi,+233 50 987 6543,jane@example.com,Licensed electrician,4.9,true,80,8,"Wiring, Repairs, Installation"
Mike Johnson,Carpenter,Takoradi,+233 20 555 1234,,Professional carpenter,4.5,false,60,5,"Furniture, Doors, Windows"
```

## Installation Steps

### Step 1: Install CSV Parser
```bash
cd backend
npm install csv-parser --save
```

### Step 2: Place CSV File
Place your `service_providers.csv` file in the **project root directory** (same level as backend/ and frontend/)

```
handiGhanav2/
├── service_providers.csv  ← Place here
├── backend/
├── frontend/
└── ...
```

### Step 3: Run Seed Script Locally

```bash
cd backend
node prisma/seed-providers.js
```

### Step 4: Deploy to Fly.io (Production)

**Option A: Upload CSV and run remotely**
```bash
# Copy CSV to Fly.io app
fly ssh sftp shell
> put service_providers.csv /app/service_providers.csv
> exit

# Run seed script
fly ssh console -C "cd /app && node prisma/seed-providers.js"
```

**Option B: Seed from local and deploy**
```bash
# Seed local database first
cd backend
node prisma/seed-providers.js

# Then push the changes
# Note: This won't work for Fly.io, use Option A instead
```

## Script Behavior

The seed script will:
1. ✅ Read the CSV file
2. ✅ Clear existing providers (can be disabled)
3. ✅ Create a User account for each provider
4. ✅ Create a Provider profile linked to the user
5. ✅ Generate default passwords ("password123") for all providers
6. ✅ Auto-generate emails if not provided
7. ✅ Set default values for missing fields

## Default Values

| Field | Default Value |
|-------|---------------|
| email | `{name}@handyghana.com` |
| password | `password123` (hashed) |
| rating | 4.5 |
| verified | Random (70% true) |
| availability | "Available Now" |
| hourlyRate | 50 GHS |
| experience | 5 years |
| reviewCount | Random (10-60) |

## Troubleshooting

### Error: "CSV file not found"
- Make sure `service_providers.csv` is in the project root
- Check the file name is exactly `service_providers.csv`

### Error: "csv-parser not found"
```bash
cd backend
npm install csv-parser
```

### Error: "Unique constraint failed on email"
- Provider emails must be unique
- The script will skip duplicates
- Remove duplicate entries from CSV

### Error: "Cannot connect to database"
- Check DATABASE_URL in backend/.env
- Verify database is running
- For Fly.io: Check `fly status`

## Verifying Import

### Check via API:
```bash
curl https://handighana-backend.fly.dev/api/providers
```

### Check via Database:
```bash
# Local
cd backend
npx prisma studio

# Fly.io
fly ssh console -C "cd /app && npx prisma studio"
```

## Updating Existing Providers

To update instead of clearing:

1. Edit `seed-providers.js`
2. Comment out this line:
```javascript
// await prisma.provider.deleteMany({})
```

3. The script will:
   - Skip existing users by email
   - Create only new providers

## Custom Seed Script

You can modify `backend/prisma/seed-providers.js` to:
- Add custom field mappings
- Handle different CSV formats
- Add validation logic
- Create related data (services, reviews, etc.)

## Example: Seeding Services Too

After seeding providers, you can create services:

```javascript
// Add this to seed-providers.js
const services = [
  { name: 'Pipe Repair', category: 'Plumbing', price: 100 },
  { name: 'Electrical Wiring', category: 'Electrician', price: 150 },
]

for (const service of services) {
  await prisma.service.create({
    data: {
      ...service,
      providerId: provider.id,
      isActive: true,
    }
  })
}
```

## Support

If you encounter issues:
1. Check the seed script logs
2. Verify CSV format matches expected columns
3. Check database connection
4. Review Prisma schema for field types
5. Check backend logs: `fly logs`

---

**Once seeding is complete, your providers will be visible in the app!** 🎉

