/**
 * Provider Dashboard API Test Script
 * 
 * Run with: node test-provider-api.js
 * 
 * Prerequisites:
 * - Backend server must be running on http://localhost:3001 (or set API_URL env var)
 * - Install dependencies: npm install (if not already installed)
 */

const BASE_URL = process.env.API_URL || 'http://localhost:3001/api'

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
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
    
    const response = await fetch(`${BASE_URL}${endpoint}`, options)
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

// Test helper - returns a promise
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

// Test suite
async function runTests() {
  console.log(`${colors.blue}========================================${colors.reset}`)
  console.log(`${colors.blue}Provider Dashboard API Tests${colors.reset}`)
  console.log(`${colors.blue}========================================${colors.reset}`)
  
  let createdProviderId = null
  let createdServiceId = null
  
  // ============================================
  // 1. PROVIDER REGISTRATION TESTS
  // ============================================
  console.log(`\n${colors.yellow}=== Provider Registration Tests ===${colors.reset}`)
  
  await test('Create Provider - Valid Data', async () => {
    const providerData = {
      name: 'Test Provider',
      category: 'Electrician',
      location: 'Accra',
      description: 'Test provider description',
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
    
    createdProviderId = result.data.provider.id
    console.log(`  Created provider ID: ${createdProviderId}`)
  })
  
  await test('Create Provider - Missing Required Fields', async () => {
    const providerData = {
      name: 'Test Provider'
      // Missing category, location, description
    }
    
    const result = await apiRequest('POST', '/providers', providerData)
    
    if (result.ok || result.status !== 400) {
      throw new Error(`Expected 400, got ${result.status}`)
    }
  })
  
  await test('Get Provider By ID', async () => {
    if (!createdProviderId) {
      throw new Error('No provider ID available')
    }
    
    const result = await apiRequest('GET', `/providers/${createdProviderId}`)
    
    if (!result.ok || result.status !== 200) {
      throw new Error(`Expected 200, got ${result.status}`)
    }
    
    if (result.data.name !== 'Test Provider') {
      throw new Error('Provider data mismatch')
    }
  })
  
  await test('Get All Providers', async () => {
    const result = await apiRequest('GET', '/providers')
    
    if (!result.ok || result.status !== 200) {
      throw new Error(`Expected 200, got ${result.status}`)
    }
    
    if (!Array.isArray(result.data)) {
      throw new Error('Expected array of providers')
    }
  })
  
  await test('Update Provider', async () => {
    if (!createdProviderId) {
      throw new Error('No provider ID available')
    }
    
    const updates = {
      description: 'Updated description'
    }
    
    const result = await apiRequest('PUT', `/providers/${createdProviderId}`, updates)
    
    if (!result.ok || result.status !== 200) {
      throw new Error(`Expected 200, got ${result.status}`)
    }
    
    if (result.data.provider.description !== 'Updated description') {
      throw new Error('Provider not updated correctly')
    }
  })
  
  // ============================================
  // 2. SERVICE MANAGEMENT TESTS
  // ============================================
  console.log(`\n${colors.yellow}=== Service Management Tests ===${colors.reset}`)
  
  await test('Create Pay-as-You-Go Service', async () => {
    if (!createdProviderId) {
      throw new Error('No provider ID available')
    }
    
    const serviceData = {
      providerId: createdProviderId,
      name: 'Test Electrical Repair',
      description: 'Test service description',
      category: 'Electrician',
      pricingModel: 'pay-as-you-go',
      basePrice: 200,
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
    
    createdServiceId = result.data.service.id
    console.log(`  Created service ID: ${createdServiceId}`)
  })
  
  await test('Create Subscription Service', async () => {
    if (!createdProviderId) {
      throw new Error('No provider ID available')
    }
    
    const serviceData = {
      providerId: createdProviderId,
      name: 'Monthly Maintenance Plan',
      description: 'Monthly maintenance subscription',
      category: 'Electrician',
      pricingModel: 'subscription',
      monthlyPrice: 150,
      billingCycle: 'monthly',
      duration: 90,
      visitsPerPeriod: 2,
      subscriptionFeatures: ['Priority Support', 'Monthly Inspection'],
      isActive: true
    }
    
    const result = await apiRequest('POST', '/services', serviceData)
    
    if (!result.ok || result.status !== 201) {
      throw new Error(`Expected 201, got ${result.status}: ${JSON.stringify(result.data)}`)
    }
  })
  
  await test('Create Service - Missing Required Fields', async () => {
    const serviceData = {
      providerId: createdProviderId,
      name: 'Test Service'
      // Missing description, category, pricingModel
    }
    
    const result = await apiRequest('POST', '/services', serviceData)
    
    if (result.ok || result.status !== 400) {
      throw new Error(`Expected 400, got ${result.status}`)
    }
  })
  
  await test('Create Service - Invalid Pricing Model', async () => {
    const serviceData = {
      providerId: createdProviderId,
      name: 'Test Service',
      description: 'Test',
      category: 'Electrician',
      pricingModel: 'pay-as-you-go',
      // Missing basePrice
      duration: 60
    }
    
    const result = await apiRequest('POST', '/services', serviceData)
    
    if (result.ok || result.status !== 400) {
      throw new Error(`Expected 400 for missing basePrice, got ${result.status}`)
    }
  })
  
  await test('Get Services by Provider ID', async () => {
    if (!createdProviderId) {
      throw new Error('No provider ID available')
    }
    
    const result = await apiRequest('GET', `/services?providerId=${createdProviderId}`)
    
    if (!result.ok || result.status !== 200) {
      throw new Error(`Expected 200, got ${result.status}`)
    }
    
    if (!Array.isArray(result.data)) {
      throw new Error('Expected array of services')
    }
    
    if (result.data.length < 2) {
      throw new Error('Expected at least 2 services')
    }
  })
  
  await test('Get Service By ID', async () => {
    if (!createdServiceId) {
      throw new Error('No service ID available')
    }
    
    const result = await apiRequest('GET', `/services/${createdServiceId}`)
    
    if (!result.ok || result.status !== 200) {
      throw new Error(`Expected 200, got ${result.status}`)
    }
    
    if (result.data.name !== 'Test Electrical Repair') {
      throw new Error('Service data mismatch')
    }
  })
  
  await test('Update Service', async () => {
    if (!createdServiceId) {
      throw new Error('No service ID available')
    }
    
    const updates = {
      basePrice: 250,
      description: 'Updated description'
    }
    
    const result = await apiRequest('PUT', `/services/${createdServiceId}`, updates)
    
    if (!result.ok || result.status !== 200) {
      throw new Error(`Expected 200, got ${result.status}`)
    }
    
    if (result.data.service.basePrice !== 250) {
      throw new Error('Service not updated correctly')
    }
  })
  
  await test('Toggle Service Status', async () => {
    if (!createdServiceId) {
      throw new Error('No service ID available')
    }
    
    // Get current status
    const getResult = await apiRequest('GET', `/services/${createdServiceId}`)
    const currentStatus = getResult.data.isActive
    
    // Toggle status
    const updateResult = await apiRequest('PUT', `/services/${createdServiceId}`, {
      isActive: !currentStatus
    })
    
    if (!updateResult.ok || updateResult.status !== 200) {
      throw new Error(`Expected 200, got ${updateResult.status}`)
    }
    
    if (updateResult.data.service.isActive === currentStatus) {
      throw new Error('Service status not toggled')
    }
    
    // Toggle back
    await apiRequest('PUT', `/services/${createdServiceId}`, {
      isActive: currentStatus
    })
  })
  
  await test('Delete Service', async () => {
    if (!createdServiceId) {
      throw new Error('No service ID available')
    }
    
    const result = await apiRequest('DELETE', `/services/${createdServiceId}`)
    
    if (!result.ok || result.status !== 200) {
      throw new Error(`Expected 200, got ${result.status}`)
    }
    
    // Verify deletion
    const getResult = await apiRequest('GET', `/services/${createdServiceId}`)
    if (getResult.status !== 404) {
      throw new Error('Service should be deleted (404 expected)')
    }
  })
  
  await test('Get Services - Filter by Active Status', async () => {
    if (!createdProviderId) {
      throw new Error('No provider ID available')
    }
    
    const result = await apiRequest('GET', `/services?providerId=${createdProviderId}&isActive=true`)
    
    if (!result.ok || result.status !== 200) {
      throw new Error(`Expected 200, got ${result.status}`)
    }
    
    if (!Array.isArray(result.data)) {
      throw new Error('Expected array of services')
    }
    
    // Verify all services are active
    const allActive = result.data.every(s => s.isActive === true)
    if (!allActive) {
      throw new Error('Not all services are active')
    }
  })
  
  // ============================================
  // 3. SUMMARY
  // ============================================
  
  console.log(`\n${colors.blue}========================================${colors.reset}`)
  console.log(`${colors.blue}Test Summary${colors.reset}`)
  console.log(`${colors.blue}========================================${colors.reset}`)
  console.log(`Total Tests: ${testResults.total}`)
  console.log(`${colors.green}Passed: ${testResults.passed}${colors.reset}`)
  console.log(`${colors.red}Failed: ${testResults.failed}${colors.reset}`)
  console.log(`${colors.blue}========================================${colors.reset}\n`)
  
  if (testResults.failed === 0) {
    console.log(`${colors.green}All tests passed! ✓${colors.reset}\n`)
    process.exit(0)
  } else {
    console.log(`${colors.red}Some tests failed. Please review the errors above.${colors.reset}\n`)
    process.exit(1)
  }
}

// Check if fetch is available (Node 18+)
if (typeof fetch === 'undefined') {
  console.error('Error: fetch is not available. Please use Node.js 18+ or install node-fetch')
  process.exit(1)
}

// Run tests
runTests().catch(error => {
  console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`)
  process.exit(1)
})

