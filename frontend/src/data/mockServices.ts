import type { Service } from '../types'

export const mockServices: Service[] = [
  {
    id: 'service-1',
    providerId: '1',
    name: 'Electrical Repair',
    description: 'Expert repair for all electrical issues including wiring, outlets, and panels',
    category: 'Electrician',
    pricingModel: 'pay-as-you-go',
    basePrice: 200,
    duration: 120,
    isActive: true
  },
  {
    id: 'service-2',
    providerId: '1',
    name: 'Panel Installation',
    description: 'Professional installation of electrical panels and circuit breakers',
    category: 'Electrician',
    pricingModel: 'pay-as-you-go',
    basePrice: 500,
    duration: 240,
    isActive: true
  },
  {
    id: 'service-3',
    providerId: '1',
    name: 'Monthly Maintenance Plan',
    description: 'Regular monthly maintenance and inspection service for your electrical systems',
    category: 'Electrician',
    pricingModel: 'subscription',
    basePrice: 50, // Setup fee
    monthlyPrice: 150,
    billingCycle: 'monthly',
    duration: 90,
    visitsPerPeriod: 2,
    subscriptionFeatures: [
      'Priority Support',
      'Monthly Inspection',
      'Preventive Maintenance',
      '10% Discount on Repairs'
    ],
    isActive: true
  },
  {
    id: 'service-4',
    providerId: '4',
    name: 'Premium Home Care Subscription',
    description: 'Comprehensive home maintenance subscription with unlimited visits and priority service',
    category: 'Handyman',
    pricingModel: 'subscription',
    basePrice: 100, // Setup fee
    monthlyPrice: 300,
    billingCycle: 'monthly',
    duration: 120,
    visitsPerPeriod: undefined, // Unlimited
    subscriptionFeatures: [
      'Unlimited Visits',
      '24/7 Priority Support',
      'Free Consultations',
      'Emergency Response',
      'Annual Safety Inspection'
    ],
    isActive: true
  },
  {
    id: 'service-5',
    providerId: '1',
    name: 'Appliance Repair',
    description: 'Repair and maintenance for home appliances',
    category: 'Electrician',
    pricingModel: 'pay-as-you-go',
    basePrice: 150,
    duration: 90,
    isActive: true
  },
  {
    id: 'service-6',
    providerId: '1',
    name: 'Emergency Electrical Service',
    description: '24/7 emergency electrical services',
    category: 'Electrician',
    pricingModel: 'pay-as-you-go',
    basePrice: 300,
    duration: 60,
    isActive: false
  }
]

