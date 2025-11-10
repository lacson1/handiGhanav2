# Mock Data for Testing

This directory contains mock data for testing the Handighana application.

## Mock Users

Test credentials for different user roles:

### Customers
- **Email:** `customer@test.com` | **Password:** `password123` (John Doe)
  - Has bookings with providers 1, 2, and 3
- **Email:** `mary@test.com` | **Password:** `password123` (Mary Mensah)
  - Has bookings with providers 1, 2, and 6
- **Email:** `kofi@test.com` | **Password:** `password123` (Kofi Asante)
  - Has bookings with providers 3, 4, 5, and 1

### Providers
- **Email:** `provider@test.com` | **Password:** `password123` (Bis FagQ - Electrician)
  - Provider ID: `1`
  - Has bookings from customers
- **Email:** `ama@test.com` | **Password:** `password123` (Ama Brown - Cleaner)
  - Provider ID: `2`
  - Has bookings from customers
- **Email:** `kwame@test.com` | **Password:** `password123` (Kwame Mensah - Plumber)
  - Provider ID: `3`
  - Has bookings from customers

### Admin
- **Email:** `admin@test.com` | **Password:** `admin123`
  - Full admin access

## Mock Providers

8 providers across different categories:
1. **Bis FagQ** - Electrician (Cape Coast) - ID: `1`
2. **Ama Brown** - Cleaner (Accra) - ID: `2`
3. **Kwame Mensah** - Plumber (Kumasi) - ID: `3`
4. **Sarah Osei** - Handyman (Accra) - ID: `4`
5. **Emmanuel Asante** - Carpenter (Takoradi) - ID: `5`
6. **Grace Adjei** - Painter (Tema) - ID: `6`
7. **Kofi Boateng** - Mechanic (Accra) - ID: `7`
8. **Abena Owusu** - Gardener (Kumasi) - ID: `8`

## Mock Bookings

9 sample bookings with different statuses (Pending, Confirmed, Completed) for testing the dashboard functionality:

- **Booking 1:** Customer-1 → Provider 1 (Bis FagQ) - Confirmed
- **Booking 2:** Customer-2 → Provider 2 (Ama Brown) - Pending
- **Booking 3:** Customer-1 → Provider 3 (Kwame Mensah) - Completed
- **Booking 4:** Customer-3 → Provider 4 (Sarah Osei) - Confirmed
- **Booking 5:** Customer-2 → Provider 1 (Bis FagQ) - Completed
- **Booking 6:** Customer-1 → Provider 2 (Ama Brown) - Pending
- **Booking 7:** Customer-3 → Provider 5 (Emmanuel Asante) - Confirmed
- **Booking 8:** Customer-2 → Provider 6 (Grace Adjei) - Pending
- **Booking 9:** Customer-3 → Provider 1 (Bis FagQ) - Pending

## Usage

The mock data is automatically used when:
- API calls fail (fallback behavior)
- Testing without a backend
- Development mode

### Testing Steps

1. **Test as Customer:**
   - Sign in with `customer@test.com` / `password123`
   - Go to Dashboard to see "My Bookings" (3 bookings)
   - Browse providers and create new bookings

2. **Test as Provider:**
   - Sign in with `provider@test.com` / `password123`
   - Go to Dashboard to see "My Jobs" (bookings for provider ID 1)
   - View and manage bookings

3. **Test as Admin:**
   - Sign in with `admin@test.com` / `admin123`
   - Access admin dashboard features

### Notes

- All mock users have the password `password123` except admin which uses `admin123`
- Mock bookings are automatically loaded when API calls fail
- Provider bookings are filtered by providerId matching the provider's ID in mockProviders
- Customer bookings are filtered by userId matching the customer's ID in mockUsers

