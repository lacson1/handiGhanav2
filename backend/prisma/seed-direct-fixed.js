const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Map categories to valid ServiceCategory enum values
function mapCategory(category) {
  const mapping = {
    'Electrician': 'Electrician',
    'Cleaner': 'Cleaner',
    'Network Setup': 'NetworkSetup',
    'Veterinary Care': 'VeterinaryCare',
    'Veterinary Histopathology': 'Pharmacy',
    'Plumber': 'Plumber',
    'Handyman': 'Handyman',
    'Carpenter': 'Carpenter',
    'Painter': 'Painter',
    'Mechanic': 'Mechanic',
    'Gardener': 'Gardener',
    'Tiler': 'Tiler',
    'Welder': 'Welder'
  }
  return mapping[category] || 'Other'
}

// Real provider data from your CSV
const realProviders = [
  {
    name: "Bis FagQ",
    phone: "+23356577372",
    whatsapp: "+447898489",
    area: "Koforidua",
    category: "Electrician",
    bio: "I'm an expert in electrical appliances and home electrification, with over 2 years of hands-on experience delivering safe, efficient, and reliable solutions.",
    rating: "5.00",
    total_reviews: "2",
    verified: "true",
    experience: "8 years",
    specializations: ["Generator", "indoors and outdoor appliances"],
    availability: "Monday, Thursday - Saturday 09:00 - 17:00",
    price_range: "GHS 200",
    service_areas: ["Cape Coast", "Elmina", "Takoradi", "Winneba"],
    response_time: "Usually within 4 hours",
    verification_status: "verified"
  },
  {
    name: "Ama Brown",
    phone: "0504910179",
    whatsapp: "0504910179",
    area: "Accra",
    category: "Cleaner",
    bio: "Professional house cleaning specialist. Available to clean whole house and emergency work.",
    rating: "5.00",
    total_reviews: "1",
    verified: "false",
    specializations: ["Pest control"],
    languages: ["English"],
    price_range: "100 to 300",
    service_areas: ["Accra kumasi"],
    emergency_services: "true",
    response_time: "20mins",
    verification_status: "unverified"
  },
  {
    name: "Jonathan Hood",
    phone: "07931133131",
    whatsapp: "07931133131",
    area: "Accra",
    category: "Network Setup",
    bio: "Setting up wifi and network in the house",
    rating: "0.00",
    total_reviews: "0",
    verified: "false",
    languages: ["English"],
    verification_status: "unverified"
  },
  {
    name: "Alfred Kwadjo",
    phone: "0015146531786",
    whatsapp: "0015146531786",
    area: "Accra",
    category: "Veterinary Care",
    bio: "Expert Animal Health Insights. Right When You Need Them.",
    rating: "0.00",
    total_reviews: "0",
    verified: "false",
    experience: "",
    specializations: ["Poultry Health and Veterinary Care"],
    languages: ["English"],
    availability: "Sunday - Friday 14:00 - 18:00",
    price_range: "250 to 500",
    emergency_services: "true",
    response_time: "45mins",
    verification_status: "unverified"
  },
  {
    name: "Value Health Pharmacy",
    phone: "+233204642884",
    whatsapp: "+233204642884",
    area: "Accra",
    category: "Veterinary Histopathology",
    bio: "Pharmacy at Korlebu. Medications available",
    rating: "0.00",
    total_reviews: "0",
    verified: "false",
    languages: ["English"],
    verification_status: "unverified"
  },
  {
    name: "Stephen Corquaye",
    phone: "+233204642884",
    whatsapp: "+233204642884",
    area: "Accra",
    category: "Veterinary Care",
    bio: "Pharmacist, supply medication",
    rating: "0.00",
    total_reviews: "0",
    verified: "false",
    languages: ["English"],
    verification_status: "unverified"
  }
]

async function main() {
  console.log('🌱 Starting to seed REAL providers...')
  console.log(`📊 Found ${realProviders.length} providers to import`)

  // Clear existing data
  console.log('🗑️  Clearing ALL existing data...')
  await prisma.review.deleteMany({})
  await prisma.booking.deleteMany({})
  await prisma.service.deleteMany({})
  await prisma.provider.deleteMany({})
  await prisma.user.deleteMany({
    where: {
      role: { in: ['PROVIDER', 'CUSTOMER'] }
    }
  })
  console.log('✅ All mock data cleared!')

  // Insert real providers
  console.log('📝 Inserting REAL providers...')
  let successCount = 0
  let errorCount = 0

  for (const row of realProviders) {
    try {
      // Generate email
      const cleanName = row.name.trim().toLowerCase().replace(/\s+/g, '.')
      const email = `${cleanName}@handyghana.com`
      
      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: '$2b$10$X7qH8YJc8QZ5fYZvT9xGxOL1Y0K1nP8fQ3mZ9vN8pL2xK5wM4rN6m', // "password123"
          name: row.name.trim(),
          role: 'PROVIDER',
        }
      })

      // Parse values
      const rating = parseFloat(row.rating) || 0
      const reviewCount = parseInt(row.total_reviews) || 0
      const verified = row.verified === 'true' || row.verification_status === 'verified'
      
      // Parse price
      let hourlyRate = 50
      if (row.price_range) {
        const match = row.price_range.match(/\d+/)
        if (match) hourlyRate = parseInt(match[0])
      }

      // Parse experience
      let experience = 5
      if (row.experience) {
        const expMatch = row.experience.match(/\d+/)
        if (expMatch) experience = parseInt(expMatch[0])
      }

      // Map category to valid enum value
      const mappedCategory = mapCategory(row.category)

      // Create provider (WITHOUT email field)
      const provider = await prisma.provider.create({
        data: {
          userId: user.id,
          name: row.name.trim(),
          category: mappedCategory,
          location: row.area || 'Accra',
          phone: row.phone || '',
          whatsapp: row.whatsapp || row.phone || '',
          description: row.bio || `Professional ${row.category} service provider`,
          rating: rating,
          reviewCount: reviewCount,
          verified: verified,
          availability: row.availability || 'Available Now',
          hourlyRate: hourlyRate,
          bio: row.bio || '',
          experience: experience,
          skills: row.specializations || [],
          certifications: [],
        }
      })

      console.log(`✅ Created provider: ${provider.name} (${mappedCategory})`)
      successCount++
    } catch (error) {
      console.error(`❌ Error creating provider ${row.name}:`, error.message)
      errorCount++
    }
  }

  console.log('\n📊 Seeding Summary:')
  console.log(`   ✅ Successfully created: ${successCount} providers`)
  console.log(`   ❌ Errors: ${errorCount}`)
  console.log('\n🎉 Real data seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Fatal error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

