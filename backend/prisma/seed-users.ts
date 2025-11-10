import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding demo users...')

  // Hash passwords
  const customerPassword = await bcrypt.hash('password123', 10)
  const providerPassword = await bcrypt.hash('password123', 10)
  const adminPassword = await bcrypt.hash('admin123', 10)

  // Create Customer Demo User
  const customer = await prisma.user.upsert({
    where: { email: 'customer@test.com' },
    update: {},
    create: {
      email: 'customer@test.com',
      name: 'John Doe',
      phone: '+233241111111',
      password: customerPassword,
      role: 'CUSTOMER',
    },
  })
  console.log('✅ Created customer:', customer.email)

  // Create Provider Demo User
  const providerUser = await prisma.user.upsert({
    where: { email: 'provider@test.com' },
    update: {},
    create: {
      email: 'provider@test.com',
      name: 'Bis FagQ',
      phone: '+233241234567',
      password: providerPassword,
      role: 'PROVIDER',
    },
  })
  console.log('✅ Created provider user:', providerUser.email)

  // Create Provider Profile
  const provider = await prisma.provider.upsert({
    where: { userId: providerUser.id },
    update: {},
    create: {
      userId: providerUser.id,
      name: 'Bis FagQ',
      category: 'Electrician',
      location: 'Cape Coast',
      description: 'Expert in electrical appliances and home wiring with 10+ years of experience.',
      phone: '+233241234567',
      whatsapp: '+233241234567',
      verified: true,
      rating: 5.0,
      reviewCount: 127,
      completionRate: 0.98,
      availability: 'AVAILABLE_NOW',
      serviceAreas: ['Cape Coast', 'Elmina', 'Saltpond'],
      skills: ['Wiring', 'Appliance Repair', 'Panel Installation'],
      verificationStatus: 'VERIFIED',
    },
  })
  console.log('✅ Created provider profile:', provider.name)

  // Create Admin Demo User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      name: 'Admin User',
      phone: '+233241111999',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('✅ Created admin:', admin.email)

  console.log('🎉 Demo users seeded successfully!')
  console.log('\n📝 Demo Credentials:')
  console.log('   Customer: customer@test.com / password123')
  console.log('   Provider: provider@test.com / password123')
  console.log('   Admin: admin@test.com / admin123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding demo users:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

