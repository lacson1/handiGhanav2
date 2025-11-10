/**
 * Frontend API Integration Test Script
 * 
 * This script tests the API endpoints that the frontend uses
 * Run with: node test-frontend-api.js
 * 
 * Prerequisites:
 * - Backend server must be running on http://localhost:3001
 * - Frontend server should be running on http://localhost:5173
 */

const API_URL = process.env.API_URL || 'http://localhost:3001/api'
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

let testResults = {
  passed: 0,
  failed: 0,
  total: 0
}

// Helper function to make API requests
async function apiRequest(method, endpoint, data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    }
    
    if (data) {
      options.body = JSON.stringify(data)
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, options)
    const result = await response.json()
    
    return {
      status: response.status,
      data: result,
      ok: response.ok
    }
  } catch (error) {
    return {
      status: 0,
      data: { error: error.message },
      ok: false
    }
  }
}

// Test helper
async function test(name, fn) {
  testResults.total++
  console.log(`\n${colors.blue}Testing: ${name}${colors.reset}`)
  
  try {
    await fn()
    testResults.passed++
    console.log(`${colors.green}✓ PASSED: ${name}${colors.reset}`)
  } catch (error) {
    testResults.failed++
    console.log(`${colors.red}✗ FAILED: ${name}${colors.reset}`)
    console.log(`${colors.red}  Error: ${error.message}${colors.reset}`)
    if (error.stack) {
      console.log(`${colors.red}  Stack: ${error.stack.split('\n')[1]}${colors.reset}`)
    }
  }
}

// Check if servers are running
async function checkServers() {
  console.log(`${colors.cyan}Checking server availability...${colors.reset}`)
  
  try {
    // Check backend
    const backendCheck = await fetch(`${API_URL.replace('/api', '/health')}`)
    if (backendCheck.ok) {
      console.log(`${colors.green}✓ Backend server is running${colors.reset}`)
    } else {
      throw new Error('Backend server not responding correctly')
    }
  } catch (error) {
    console.log(`${colors.red}✗ Backend server check failed: ${error.message}${colors.reset}`)
    console.log(`${colors.yellow}  Make sure backend is running on port 3001${colors.reset}`)
  }
  
  try {
    // Check frontend
    const frontendCheck = await fetch(FRONTEND_URL)
    if (frontendCheck.ok) {
      console.log(`${colors.green}✓ Frontend server is running${colors.reset}`)
    } else {
      throw new Error('Frontend server not responding correctly')
    }
  } catch (error) {
    console.log(`${colors.yellow}⚠ Frontend server check failed: ${error.message}${colors.reset}`)
    console.log(`${colors.yellow}  Make sure frontend is running on port 5173${colors.reset}`)
  }
}

// Test suite
async function runTests() {
  console.log(`${colors.blue}========================================${colors.reset}`)
  console.log(`${colors.blue}Frontend API Integration Tests${colors.reset}`)
  console.log(`${colors.blue}========================================${colors.reset}`)
  
  await checkServers()
  
  let testProviderId = null
  let testServiceId = null
  
  // ============================================
  // 1. PROVIDER REGISTRATION FLOW
  // ============================================
  console.log(`\n${colors.yellow}=== Provider Registration Flow ===${colors.reset}`)
  
  await test('Create Provider via API (Frontend Flow)', async () => {
    const providerData = {
      name: 'Frontend Test Provider',
      category: 'Electrician',
      location: 'Accra',
      description: 'Testing provider registration from frontend',
      phone: '+233 24 123 4567',
      whatsapp: '+233 24 123 4567'
    }
    
    const result = await apiRequest('POST', '/providers', providerData)
    
    if (!result.ok || result.status !== 201) {
      throw new Error(`Expected 201, got ${result.status}: ${JSON.stringify(result.data)}`)
    }
    
    if (!result.data.provider || !result.data.provider.id) {
      throw new Error('Provider ID not returned')
    }
    
    testProviderId = result.data.provider.id
    console.log(`  ✓ Provider created with ID: ${testProviderId}`)
  })
  
  await test('Verify Provider Appears in List (Frontend View)', async () => {
    const result = await apiRequest('GET', '/providers')
    
    if (!result.ok || result.status !== 200) {
      throw new Error(`Expected 200, got ${result.status}`)
    }
    
    if (!Array.isArray(result.data)) {
      throw new Error('Expected array of providers')
    }
    
    const foundProvider = result.data.find(p => p.id === testProviderId)
    if (!foundProvider) {
      throw new Error('Created provider not found in list')
    }
    
    console.log(`  ✓ Provider found in list (${result.data.length} total providers)`)
  })
  
  // ============================================
  // 2. SERVICE MANAGEMENT FLOW
  // ============================================
  console.log(`\n${colors.yellow}=== Service Management Flow ===${colors.reset}`)
  
  await test('Create Service (Frontend Flow)', async () => {
    if (!testProviderId) {
      throw new Error('No provider ID available')
    }
    
    const serviceData = {
      providerId: testProviderId,
      name: 'Frontend Test Service',
      description: 'Testing service creation from frontend',
      category: 'Electrician',
      pricingModel: 'pay-as-you-go',
      basePrice: 250,
      duration: 120,
      isActive: true
    }
    
    const result = await apiRequest('POST', '/services', serviceData)
    
    if (!result.ok || result.status !== 201) {
      throw new Error(`Expected 201, got ${result.status}: ${JSON.stringify(result.data)}`)
    }
    
    if (!result.data.service || !result.data.service.id) {
      throw new Error('Service ID not returned')
    }
    
    testServiceId = result.data.service.id
    console.log(`  ✓ Service created with ID: ${testServiceId}`)
  })
  
  await test('Get Services for Provider (Frontend Dashboard)', async () => {
    if (!testProviderId) {
      throw new Error('No provider ID available')
    }
    
    const result = await apiRequest('GET', `/services?providerId=${testProviderId}`)
    
    if (!result.ok || result.status !== 200) {
      throw new Error(`Expected 200, got ${result.status}`)
    }
    
    if (!Array.isArray(result.data)) {
      throw new Error('Expected array of services')
    }
    
    const foundService = result.data.find(s => s.id === testServiceId)
    if (!foundService) {
      throw new Error('Created service not found in provider services')
    }
    
    console.log(`  ✓ Service found in provider services (${result.data.length} total)`)
  })
  
  await test('Update Service (Frontend Edit Flow)', async () => {
    if (!testServiceId) {
      throw new Error('No service ID available')
    }
    
    const updates = {
      basePrice: 300,
      description: 'Updated service description from frontend'
    }
    
    const result = await apiRequest('PUT', `/services/${testServiceId}`, updates)
    
    if (!result.ok || result.status !== 200) {
      throw new Error(`Expected 200, got ${result.status}`)
    }
    
    if (result.data.service.basePrice !== 300) {
      throw new Error('Service not updated correctly')
    }
    
    console.log(`  ✓ Service updated successfully`)
  })
  
  await test('Toggle Service Status (Frontend Toggle)', async () => {
    if (!testServiceId) {
      throw new Error('No service ID available')
    }
    
    // Get current status
    const getResult = await apiRequest('GET', `/services/${testServiceId}`)
    const currentStatus = getResult.data.isActive
    
    // Toggle
    const updateResult = await apiRequest('PUT', `/services/${testServiceId}`, {
      isActive: !currentStatus
    })
    
    if (!updateResult.ok) {
      throw new Error('Failed to toggle service status')
    }
    
    // Verify toggle
    const verifyResult = await apiRequest('GET', `/services/${testServiceId}`)
    if (verifyResult.data.isActive === currentStatus) {
      throw new Error('Service status not toggled')
    }
    
    console.log(`  ✓ Service status toggled from ${currentStatus} to ${!currentStatus}`)
  })
  
  // ============================================
  // 3. API ENDPOINT VERIFICATION
  // ============================================
  console.log(`\n${colors.yellow}=== API Endpoint Verification ===${colors.reset}`)
  
  await test('Verify Providers API Endpoint', async () => {
    const result = await apiRequest('GET', '/providers')
    
    if (!result.ok || result.status !== 200) {
      throw new Error(`Providers endpoint returned ${result.status}`)
    }
    
    console.log(`  ✓ Providers endpoint accessible`)
  })
  
  await test('Verify Services API Endpoint', async () => {
    const result = await apiRequest('GET', '/services')
    
    if (!result.ok || result.status !== 200) {
      throw new Error(`Services endpoint returned ${result.status}`)
    }
    
    console.log(`  ✓ Services endpoint accessible`)
  })
  
  await test('Verify Provider Filtering Works', async () => {
    const result = await apiRequest('GET', '/providers?category=Electrician&location=Accra')
    
    if (!result.ok || result.status !== 200) {
      throw new Error(`Filtering failed with status ${result.status}`)
    }
    
    if (!Array.isArray(result.data)) {
      throw new Error('Expected array from filtered results')
    }
    
    // Verify all results match filters
    const allMatch = result.data.every(p => 
      p.category === 'Electrician' && p.location === 'Accra'
    )
    
    if (!allMatch && result.data.length > 0) {
      throw new Error('Filter results do not match filter criteria')
    }
    
    console.log(`  ✓ Provider filtering works (${result.data.length} results)`)
  })
  
  await test('Verify Service Filtering Works', async () => {
    if (!testProviderId) {
      throw new Error('No provider ID available')
    }
    
    const result = await apiRequest('GET', `/services?providerId=${testProviderId}&isActive=true`)
    
    if (!result.ok || result.status !== 200) {
      throw new Error(`Service filtering failed with status ${result.status}`)
    }
    
    if (!Array.isArray(result.data)) {
      throw new Error('Expected array from filtered results')
    }
    
    // Verify all results are active
    const allActive = result.data.every(s => s.isActive === true)
    if (!allActive && result.data.length > 0) {
      throw new Error('Not all filtered services are active')
    }
    
    console.log(`  ✓ Service filtering works (${result.data.length} active services)`)
  })
  
  // ============================================
  // 4. SUMMARY
  // ============================================
  
  console.log(`\n${colors.blue}========================================${colors.reset}`)
  console.log(`${colors.blue}Test Summary${colors.reset}`)
  console.log(`${colors.blue}========================================${colors.reset}`)
  console.log(`Total Tests: ${testResults.total}`)
  console.log(`${colors.green}Passed: ${testResults.passed}${colors.reset}`)
  console.log(`${colors.red}Failed: ${testResults.failed}${colors.reset}`)
  console.log(`${colors.blue}========================================${colors.reset}\n`)
  
  if (testResults.failed === 0) {
    console.log(`${colors.green}All API integration tests passed! ✓${colors.reset}`)
    console.log(`${colors.cyan}\nNext Steps:${colors.reset}`)
    console.log(`1. Open ${FRONTEND_URL} in your browser`)
    console.log(`2. Test provider registration at /become-provider`)
    console.log(`3. Test service management in provider dashboard`)
    console.log(`4. Test workflow management features`)
    console.log(`5. Follow manual testing guide in TEST_PROVIDER_DASHBOARD.md\n`)
    process.exit(0)
  } else {
    console.log(`${colors.red}Some tests failed. Please review the errors above.${colors.reset}\n`)
    process.exit(1)
  }
}

// Check if fetch is available
if (typeof fetch === 'undefined') {
  console.error('Error: fetch is not available. Please use Node.js 18+ or install node-fetch')
  process.exit(1)
}

// Run tests
runTests().catch(error => {
  console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`)
  process.exit(1)
})

