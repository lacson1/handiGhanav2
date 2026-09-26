import type { Provider, Service } from '../types'
// Fictional fixtures. Never pass these IDs to the live API.
export const sampleProviders: Provider[] = [
  { id: 'sample-electrician', userId: 'sample-1', name: 'Sample Electrical', category: 'Electrician', location: 'Accra', serviceAreas: ['East Legon', 'Tema'], rating: 4.8, reviewCount: 12, verified: true, availability: 'Available Now', description: 'Fictional profile: help with sockets, lighting and electrical checks.', skills: ['Lighting', 'Socket repairs'] },
  { id: 'sample-plumber', userId: 'sample-2', name: 'Sample Plumbing', category: 'Plumber', location: 'Accra', rating: 4.6, reviewCount: 8, verified: true, availability: 'Available Now', description: 'Fictional profile: leaking taps, blocked drains and pipe repairs.' },
  { id: 'sample-cleaner', userId: 'sample-3', name: 'Sample Cleaning', category: 'Cleaner', location: 'Kumasi', rating: 0, reviewCount: 0, verified: false, availability: 'Available Soon', description: 'Fictional profile: regular home cleaning and a fresh start after moving.' },
]
export const sampleServices: Service[] = [
  { id: 'sample-socket', providerId: 'sample-electrician', category: 'Electrician', name: 'Socket inspection', description: 'Inspect one faulty socket. Materials are not included in this example.', basePrice: 150, duration: 60, pricingModel: 'pay-as-you-go', isActive: true },
  { id: 'sample-light', providerId: 'sample-electrician', category: 'Electrician', name: 'Light fitting installation', description: 'Install one customer-supplied light fitting.', basePrice: 200, duration: 90, pricingModel: 'pay-as-you-go', isActive: true },
  { id: 'sample-tap', providerId: 'sample-plumber', category: 'Plumber', name: 'Leaking tap inspection', description: 'Inspect a leaking tap. Replacement parts are extra in this example.', basePrice: 120, duration: 60, pricingModel: 'pay-as-you-go', isActive: true },
  { id: 'sample-clean', providerId: 'sample-cleaner', category: 'Cleaner', name: 'Two-bedroom home clean', description: 'An example standard cleaning visit.', basePrice: 250, duration: 120, pricingModel: 'pay-as-you-go', isActive: true },
]
