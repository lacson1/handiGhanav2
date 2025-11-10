export interface MockUser {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN'
  password: string // For testing purposes only
}

export const mockUsers: MockUser[] = [
  // Customers
  {
    id: 'customer-1',
    email: 'customer@test.com',
    name: 'John Doe',
    phone: '+233241111111',
    role: 'CUSTOMER',
    password: 'password123'
  },
  {
    id: 'customer-2',
    email: 'mary@test.com',
    name: 'Mary Mensah',
    phone: '+233241111112',
    role: 'CUSTOMER',
    password: 'password123'
  },
  {
    id: 'customer-3',
    email: 'kofi@test.com',
    name: 'Kofi Asante',
    phone: '+233241111113',
    role: 'CUSTOMER',
    password: 'password123'
  },
  // Providers
  {
    id: 'provider-1',
    email: 'provider@test.com',
    name: 'Bis FagQ',
    phone: '+233241234567',
    role: 'PROVIDER',
    password: 'password123'
  },
  {
    id: 'provider-2',
    email: 'ama@test.com',
    name: 'Ama Brown',
    phone: '+233241234568',
    role: 'PROVIDER',
    password: 'password123'
  },
  {
    id: 'provider-3',
    email: 'kwame@test.com',
    name: 'Kwame Mensah',
    phone: '+233241234569',
    role: 'PROVIDER',
    password: 'password123'
  },
  // Admin
  {
    id: 'admin-1',
    email: 'admin@test.com',
    name: 'Admin User',
    phone: '+233241111999',
    role: 'ADMIN',
    password: 'admin123'
  }
]

// Helper function to get user by email and password (for testing)
export function getMockUser(email: string, password: string): MockUser | null {
  return mockUsers.find(u => u.email === email && u.password === password) || null
}

// Helper function to get user by id
export function getMockUserById(id: string): MockUser | null {
  return mockUsers.find(u => u.id === id) || null
}

