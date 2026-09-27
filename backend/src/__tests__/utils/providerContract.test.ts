import { createProviderSchema } from '../../validators/provider.validator'
import { createBookingSchema } from '../../validators/booking.validator'
it('accepts the onboarding payload and persisted service category', () => {
  expect(createProviderSchema.safeParse({ body: { name: 'Sample Professional', category: 'Electrician', location: 'Accra', description: 'Electrical inspections and repairs', firstService: { name: 'Inspection', basePrice: 150, duration: 60 }, serviceAreas: ['Tema'] } }).success).toBe(true)
})
it('accepts the booking date and 24-hour time contract', () => {
  expect(createBookingSchema.safeParse({ body: { providerId: 'sample', date: '2099-10-05T00:00:00.000Z', time: '11:00', serviceType: 'Inspection' } }).success).toBe(true)
})
