import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const demoProviders = [
  {
    email: 'kwame.boakye@handiwork.com',
    name: 'Kwame Boakye',
    phone: '+233241234501',
    category: 'Plumber' as const,
    location: 'Accra',
    description: 'Expert plumber with 15 years experience in residential and commercial plumbing',
    rating: 4.9,
    reviewCount: 234,
    verified: true,
    availability: 'AVAILABLE_NOW' as const,
    serviceAreas: ['Accra', 'Tema', 'Madina'],
    skills: ['Pipe Installation', 'Leak Repairs', 'Bathroom Fitting'],
    completionRate: 0.96
  },
  {
    email: 'ama.asante@carpenter.gh',
    name: 'Ama Asante',
    phone: '+233241234502',
    category: 'Carpenter' as const,
    location: 'Kumasi',
    description: 'Professional carpenter specializing in custom furniture and home improvements',
    rating: 4.8,
    reviewCount: 156,
    verified: true,
    availability: 'AVAILABLE_NOW' as const,
    serviceAreas: ['Kumasi', 'Ejisu', 'Mampong'],
    skills: ['Custom Furniture', 'Cabinet Making', 'Door Installation'],
    completionRate: 0.94
  },
  {
    email: 'yaw.mensah@electric.com',
    name: 'Yaw Mensah',
    phone: '+233241234503',
    category: 'Electrician' as const,
    location: 'Takoradi',
    description: 'Licensed electrician for all your electrical needs',
    rating: 4.7,
    reviewCount: 189,
    verified: true,
    availability: 'AVAILABLE_SOON' as const,
    serviceAreas: ['Takoradi', 'Sekondi', 'Effia'],
    skills: ['Wiring', 'Panel Installation', 'Lighting'],
    completionRate: 0.92
  },
  {
    email: 'kofi.adjei@cleaner.gh',
    name: 'Kofi Adjei',
    phone: '+233241234504',
    category: 'Cleaner' as const,
    location: 'Accra',
    description: 'Professional cleaning services for homes and offices',
    rating: 4.6,
    reviewCount: 278,
    verified: true,
    availability: 'AVAILABLE_NOW' as const,
    serviceAreas: ['Accra', 'East Legon', 'Airport'],
    skills: ['Deep Cleaning', 'Office Cleaning', 'Carpet Cleaning'],
    completionRate: 0.95
  },
  {
    email: 'abena.owusu@painter.com',
    name: 'Abena Owusu',
    phone: '+233241234505',
    category: 'Painter' as const,
    location: 'Cape Coast',
    description: 'Expert painter with attention to detail and quality finishes',
    rating: 4.9,
    reviewCount: 167,
    verified: true,
    availability: 'AVAILABLE_NOW' as const,
    serviceAreas: ['Cape Coast', 'Elmina', 'Moree'],
    skills: ['Interior Painting', 'Exterior Painting', 'Wall Finishing'],
    completionRate: 0.97
  },
  {
    email: 'kwesi.appiah@garden.gh',
    name: 'Kwesi Appiah',
    phone: '+233241234506',
    category: 'Gardener' as const,
    location: 'Kumasi',
    description: 'Professional landscaping and garden maintenance services',
    rating: 4.5,
    reviewCount: 92,
    verified: true,
    availability: 'AVAILABLE_SOON' as const,
    serviceAreas: ['Kumasi', 'Asokwa', 'Adum'],
    skills: ['Landscaping', 'Lawn Mowing', 'Tree Trimming'],
    completionRate: 0.89
  },
  {
    email: 'akua.mensah@tailor.com',
    name: 'Akua Mensah',
    phone: '+233241234507',
    category: 'Tailor' as const,
    location: 'Accra',
    description: 'Custom tailoring and alterations with modern and traditional styles',
    rating: 4.8,
    reviewCount: 312,
    verified: true,
    availability: 'AVAILABLE_NOW' as const,
    serviceAreas: ['Accra', 'Osu', 'Labone'],
    skills: ['Custom Suits', 'Traditional Wear', 'Alterations'],
    completionRate: 0.93
  },
  {
    email: 'samuel.boateng@mechanic.gh',
    name: 'Samuel Boateng',
    phone: '+233241234508',
    category: 'Mechanic' as const,
    location: 'Tema',
    description: 'Experienced auto mechanic for all vehicle repairs and maintenance',
    rating: 4.7,
    reviewCount: 201,
    verified: true,
    availability: 'AVAILABLE_NOW' as const,
    serviceAreas: ['Tema', 'Ashaiman', 'Dawhenya'],
    skills: ['Engine Repair', 'Brake Service', 'Oil Changes'],
    completionRate: 0.91
  },
  {
    email: 'efua.darko@caterer.com',
    name: 'Efua Darko',
    phone: '+233241234509',
    category: 'Caterer' as const,
    location: 'Accra',
    description: 'Professional catering for all events - weddings, parties, corporate events',
    rating: 4.9,
    reviewCount: 145,
    verified: true,
    availability: 'AVAILABLE_SOON' as const,
    serviceAreas: ['Accra', 'Kasoa', 'Winneba'],
    skills: ['Event Catering', 'Local Cuisine', 'International Dishes'],
    completionRate: 0.98
  },
  {
    email: 'kwabena.osei@hvac.gh',
    name: 'Kwabena Osei',
    phone: '+233241234510',
    category: 'AC_Technician' as const,
    location: 'Accra',
    description: 'AC installation, repair and maintenance specialist',
    rating: 4.6,
    reviewCount: 178,
    verified: true,
    availability: 'AVAILABLE_NOW' as const,
    serviceAreas: ['Accra', 'Spintex', 'Teshie'],
    skills: ['AC Installation', 'AC Repair', 'Refrigeration'],
    completionRate: 0.90
  }
]

async function main() {
  console.log('🌱 Seeding demo providers...')

  const password = await bcrypt.hash('password123', 10)

  for (const providerData of demoProviders) {
    try {
      // Create user first
      const user = await prisma.user.upsert({
        where: { email: providerData.email },
        update: {},
        create: {
          email: providerData.email,
          name: providerData.name,
          phone: providerData.phone,
          password,
          role: 'PROVIDER',
        },
      })

      // Create provider profile
      await prisma.provider.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          name: providerData.name,
          category: providerData.category,
          location: providerData.location,
          description: providerData.description,
          phone: providerData.phone,
          whatsapp: providerData.phone,
          verified: providerData.verified,
          rating: providerData.rating,
          reviewCount: providerData.reviewCount,
          completionRate: providerData.completionRate,
          availability: providerData.availability,
          serviceAreas: providerData.serviceAreas,
          skills: providerData.skills,
          verificationStatus: 'VERIFIED',
        },
      })

      console.log(`✅ Created provider: ${providerData.name} (${providerData.category})`)
    } catch (error) {
      console.error(`❌ Error creating ${providerData.name}:`, error)
    }
  }

  console.log('🎉 Demo providers seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding demo providers:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

