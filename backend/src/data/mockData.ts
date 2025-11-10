// Mock data matching frontend structure

export interface MockUser {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN'
  password: string
}

export interface MockProvider {
  id: string
  name: string
  category: string
  rating: number
  reviewCount: number
  location: string
  verified: boolean
  description: string
  availability: "Available Now" | "Available Soon" | "Not Available"
  quickSlots?: string[]
  phone?: string
  whatsapp?: string
  avatar?: string
  serviceAreas?: string[]
  skills?: string[]
  completionRate?: number
  joinedDate?: string
}

export interface MockBooking {
  id: string
  providerId: string
  userId: string
  date: string
  time: string
  serviceType: string
  notes?: string
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled"
  createdAt: string
}

export const mockUsers: MockUser[] = [
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
  {
    id: 'admin-1',
    email: 'admin@test.com',
    name: 'Admin User',
    phone: '+233241111999',
    role: 'ADMIN',
    password: 'admin123'
  }
]

export const mockProviders: MockProvider[] = [
  {
    id: "1",
    name: "Bis FagQ",
    category: "Electrician",
    rating: 5.0,
    reviewCount: 127,
    location: "Cape Coast",
    verified: true,
    description: "Expert in electrical appliances and home wiring with 10+ years of experience.",
    availability: "Available Now",
    quickSlots: ["Today 2PM", "Today 5PM", "Tomorrow 9AM"],
    phone: "+233241234567",
    whatsapp: "+233241234567",
    serviceAreas: ["Cape Coast", "Elmina", "Saltpond"],
    skills: ["Wiring", "Appliance Repair", "Panel Installation"],
    completionRate: 0.98,
    joinedDate: "2022-01-15"
  },
  {
    id: "2",
    name: "Ama Brown",
    category: "Cleaner",
    rating: 5.0,
    reviewCount: 89,
    location: "Accra",
    verified: true,
    description: "Professional house cleaning specialist. Deep cleaning and office maintenance.",
    availability: "Available Now",
    quickSlots: ["Today 3PM", "Tomorrow 10AM", "Tomorrow 2PM"],
    phone: "+233241234568",
    whatsapp: "+233241234568",
    serviceAreas: ["Accra", "Tema", "East Legon"],
    skills: ["Deep Cleaning", "Office Cleaning", "Window Cleaning"],
    joinedDate: "2023-03-20"
  },
  {
    id: "3",
    name: "Kwame Mensah",
    category: "Plumber",
    rating: 4.8,
    reviewCount: 156,
    location: "Kumasi",
    verified: true,
    description: "Licensed plumber specializing in pipe installation, leak repairs, and bathroom renovations.",
    availability: "Available Soon",
    quickSlots: ["Tomorrow 8AM", "Tomorrow 1PM", "Tomorrow 4PM"],
    phone: "+233241234569",
    whatsapp: "+233241234569",
    serviceAreas: ["Kumasi", "Ejisu", "Bekwai"],
    skills: ["Pipe Installation", "Leak Repair", "Bathroom Renovation"],
    completionRate: 0.95,
    joinedDate: "2021-06-10"
  },
  {
    id: "4",
    name: "Sarah Osei",
    category: "Handyman",
    rating: 4.9,
    reviewCount: 203,
    location: "Accra",
    verified: true,
    description: "Versatile handyman for all your home repair needs. Furniture assembly, mounting, and general repairs.",
    availability: "Available Now",
    quickSlots: ["Today 4PM", "Today 6PM", "Tomorrow 11AM"],
    phone: "+233241234570",
    whatsapp: "+233241234570",
    serviceAreas: ["Accra", "Tema", "Spintex"],
    skills: ["Furniture Assembly", "Mounting", "General Repairs"],
    completionRate: 0.97,
    joinedDate: "2020-11-05"
  },
  {
    id: "5",
    name: "Emmanuel Asante",
    category: "Carpenter",
    rating: 4.7,
    reviewCount: 94,
    location: "Takoradi",
    verified: true,
    description: "Custom furniture maker and carpenter. Specializes in cabinets, shelves, and custom woodwork.",
    availability: "Available Now",
    quickSlots: ["Today 1PM", "Tomorrow 9AM", "Tomorrow 3PM"],
    phone: "+233241234571",
    whatsapp: "+233241234571",
    serviceAreas: ["Takoradi", "Sekondi", "Elubo"],
    skills: ["Custom Furniture", "Cabinets", "Woodwork"],
    joinedDate: "2022-08-12"
  },
  {
    id: "6",
    name: "Grace Adjei",
    category: "Painter",
    rating: 4.9,
    reviewCount: 78,
    location: "Tema",
    verified: true,
    description: "Professional interior and exterior painter. High-quality finishes and color consultation available.",
    availability: "Available Soon",
    quickSlots: ["Tomorrow 7AM", "Tomorrow 12PM", "Tomorrow 5PM"],
    phone: "+233241234572",
    whatsapp: "+233241234572",
    serviceAreas: ["Tema", "Accra", "Ashaiman"],
    skills: ["Interior Painting", "Exterior Painting", "Color Consultation"],
    completionRate: 0.99,
    joinedDate: "2023-01-18"
  },
  {
    id: "7",
    name: "Kofi Boateng",
    category: "Mechanic",
    rating: 4.6,
    reviewCount: 142,
    location: "Accra",
    verified: true,
    description: "Experienced auto mechanic specializing in engine repair, diagnostics, and maintenance.",
    availability: "Available Now",
    quickSlots: ["Today 10AM", "Today 3PM", "Tomorrow 8AM"],
    phone: "+233241234573",
    whatsapp: "+233241234573",
    serviceAreas: ["Accra", "Tema", "Madina"],
    skills: ["Engine Repair", "Diagnostics", "Maintenance"],
    completionRate: 0.94,
    joinedDate: "2021-09-22"
  },
  {
    id: "8",
    name: "Abena Owusu",
    category: "Gardener",
    rating: 4.8,
    reviewCount: 67,
    location: "Kumasi",
    verified: false,
    description: "Landscaping and garden maintenance expert. Lawn care, planting, and garden design services.",
    availability: "Available Now",
    quickSlots: ["Today 9AM", "Tomorrow 7AM", "Tomorrow 2PM"],
    phone: "+233241234574",
    whatsapp: "+233241234574",
    serviceAreas: ["Kumasi", "Ejisu"],
    skills: ["Landscaping", "Lawn Care", "Garden Design"],
    joinedDate: "2023-05-10"
  },
  {
    id: "9",
    name: "Michael Tetteh",
    category: "Emergency Service",
    rating: 4.9,
    reviewCount: 215,
    location: "Accra",
    verified: true,
    description: "24/7 Emergency Response Team - Available for urgent electrical, plumbing, and structural repairs across Ghana.",
    availability: "Available Now",
    quickSlots: ["Available 24/7", "Immediate Response", "Fast Dispatch"],
    phone: "+233241234575",
    whatsapp: "+233241234575",
    serviceAreas: ["Accra", "Tema", "Kumasi", "Cape Coast", "Takoradi"],
    skills: ["Emergency Repairs", "24/7 Response", "Fast Service", "Urgent Fixes"],
    completionRate: 0.98,
    joinedDate: "2020-03-15"
  },
  {
    id: "10",
    name: "Rescue Services Ghana",
    category: "Emergency Service",
    rating: 5.0,
    reviewCount: 312,
    location: "Kumasi",
    verified: true,
    description: "Premier emergency repair service. Lightning-fast response for all urgent home and business repairs nationwide.",
    availability: "Available Now",
    quickSlots: ["24/7 Available", "Rapid Response", "Emergency Only"],
    phone: "+233241234576",
    whatsapp: "+233241234576",
    serviceAreas: ["Kumasi", "Accra", "Tamale", "Sunyani", "Ho"],
    skills: ["Emergency Response", "Urgent Repairs", "24/7 Service", "Critical Fixes"],
    completionRate: 0.99,
    joinedDate: "2019-11-20"
  },
]

export const mockBookings: MockBooking[] = [
  {
    id: 'booking-1',
    providerId: '1',
    userId: 'customer-1',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    time: '10:00 AM',
    serviceType: 'Electrical Repair',
    notes: 'Need to fix faulty wiring in the kitchen',
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'booking-2',
    providerId: '2',
    userId: 'customer-2',
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    time: '2:00 PM',
    serviceType: 'Deep Cleaning',
    notes: 'Full house deep cleaning needed',
    status: 'Pending',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'booking-3',
    providerId: '3',
    userId: 'customer-1',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    time: '3:00 PM',
    serviceType: 'Plumbing Repair',
    notes: 'Bathroom leak repair',
    status: 'Completed',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'booking-4',
    providerId: '4',
    userId: 'customer-3',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    time: '11:00 AM',
    serviceType: 'Furniture Assembly',
    notes: 'Assemble new dining table and chairs',
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'booking-5',
    providerId: '1',
    userId: 'customer-2',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    time: '9:00 AM',
    serviceType: 'Panel Installation',
    notes: 'Install new electrical panel',
    status: 'Completed',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'booking-6',
    providerId: '2',
    userId: 'customer-1',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    time: '8:00 AM',
    serviceType: 'Office Cleaning',
    notes: 'Weekly office cleaning service',
    status: 'Pending',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'booking-7',
    providerId: '5',
    userId: 'customer-3',
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    time: '1:00 PM',
    serviceType: 'Custom Cabinet',
    notes: 'Build custom kitchen cabinets',
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'booking-8',
    providerId: '6',
    userId: 'customer-2',
    date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    time: '10:00 AM',
    serviceType: 'Interior Painting',
    notes: 'Paint living room and bedroom',
    status: 'Pending',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'booking-9',
    providerId: '1',
    userId: 'customer-3',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    time: '2:00 PM',
    serviceType: 'Appliance Repair',
    notes: 'Fix washing machine',
    status: 'Pending',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
]

// Helper functions
export function getMockUserByEmail(email: string): MockUser | undefined {
  return mockUsers.find(u => u.email === email)
}

export function getMockUserById(id: string): MockUser | undefined {
  return mockUsers.find(u => u.id === id)
}

export function getProviderById(id: string): MockProvider | undefined {
  return mockProviders.find(p => p.id === id)
}

