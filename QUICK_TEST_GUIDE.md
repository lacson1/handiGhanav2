# Quick Test Guide - Provider Dashboard

## Quick Start Testing

### 1. Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 2. Run API Tests

**Terminal 3 - Run Automated API Tests:**
```bash
cd backend
node test-provider-api.js
```

**Expected Output:**
- ✓ All provider registration tests
- ✓ All service management tests
- ✓ Test summary with pass/fail counts

### 3. Manual Frontend Testing

1. **Open Browser:** Navigate to `http://localhost:5173`

2. **Test Provider Registration:**
   - Go to `/become-provider`
   - Fill form and submit
   - Complete verification steps

3. **Test Services:**
   - Sign in as provider
   - Go to Provider Dashboard → Services
   - Create, edit, toggle, delete services

4. **Test Workflow:**
   - Go to Provider Dashboard → Workflow
   - Create tasks, drag & drop, use filters
   - Test all views (Board, List, Calendar, Analytics)

5. **Test Other Features:**
   - Bookings management
   - Finance management
   - Customer management
   - Business tools
   - Settings

## Test Checklist (Quick)

- [ ] Backend server running
- [ ] Frontend server running
- [ ] API tests pass
- [ ] Provider registration works
- [ ] Service CRUD operations work
- [ ] Workflow management works
- [ ] All dashboard tabs accessible

## Common Test Data

**Provider Registration:**
- Name: "Test Provider"
- Category: "Electrician"
- Location: "Accra"
- Contact: "+233 24 123 4567"
- Bio: "Test provider description"

**Service Creation:**
- Name: "Test Service"
- Category: "Electrician"
- Pricing: Pay-as-you-go, Base Price: 200
- Duration: 120 minutes

**Task Creation:**
- Title: "Test Task"
- Priority: "High"
- Status: "Not Started"
- Due Date: Tomorrow

## Troubleshooting

**API Tests Fail:**
- Ensure backend is running on port 3001
- Check Node.js version (18+ required for fetch)
- Check console for error messages

**Frontend Tests Fail:**
- Ensure frontend is running on port 5173
- Check browser console for errors
- Verify API endpoints are correct

**Services Not Loading:**
- Check backend API is responding
- Verify providerId is correct
- Check network tab in browser dev tools

## Next Steps

After basic tests pass:
1. Test edge cases
2. Test error handling
3. Test with different user roles
4. Test responsive design
5. Test dark mode
6. Test all integrations

For detailed test scenarios, see `TEST_PROVIDER_DASHBOARD.md`

