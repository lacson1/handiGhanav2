const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')
const csvParser = require('csv-parser')

const prisma = new PrismaClient()

// Helper to parse JSON fields safely
function parseJSON(str) {
  if (!str) return []
  try {
    // Remove extra quotes and parse
    const cleaned = str.replace(/^""|""$/g, '').replace(/""/g, '"')
    return JSON.parse(cleaned)
  } catch (e) {
    return []
  }
}

async function main() {
  console.log('🌱 Starting to seed REAL providers from CSV...')

  const csvFilePath = path.join(__dirname, '../../service_providers.csv')

  if (!fs.existsSync(csvFilePath)) {
    console.error('❌ CSV file not found at:', csvFilePath)
    process.exit(1)
  }

  const providers = []

  // Read CSV file
  await new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on('data', (row) => {
        providers.push(row)
      })
      .on('end', () => {
        console.log(`📊 Found ${providers.length} providers in CSV`)
        resolve()
      })
      .on('error', reject)
  })

  // Clear existing providers
  console.log('🗑️  Clearing ALL existing providers and users...')
  
  // Delete in correct order to respect foreign key constraints
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

  // Insert real providers from CSV
  console.log('📝 Inserting REAL providers...')
  let successCount = 0
  let errorCount = 0

  for (const row of providers) {
    try {
      // Generate email from name or use phone
      const cleanName = row.name.trim().toLowerCase().replace(/\s+/g, '.')
      const email = `${cleanName}@handyghana.com`
      
      // Check if user already exists
      let user = await prisma.user.findUnique({
        where: { email }
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            password: '$2b$10$X7qH8YJc8QZ5fYZvT9xGxOL1Y0K1nP8fQ3mZ9vN8pL2xK5wM4rN6m', // "password123"
            name: row.name.trim(),
            role: 'PROVIDER',
          }
        })
      }

      // Parse JSON fields
      const services = parseJSON(row.services)
      const specializations = parseJSON(row.specializations)
      const serviceAreas = parseJSON(row.service_areas)
      const languages = parseJSON(row.languages)

      // Parse rating and reviews
      const rating = parseFloat(row.rating) || 0
      const reviewCount = parseInt(row.total_reviews) || 0
      
      // Parse verified status
      const verified = row.verified === 'true' || row.verified === '1' || row.verification_status === 'verified'

      // Parse price range
      let hourlyRate = 50 // default
      if (row.price_range) {
        const match = row.price_range.match(/\d+/)
        if (match) {
          hourlyRate = parseInt(match[0])
        }
      }

      // Parse experience
      let experience = 5 // default
      if (row.experience) {
        const expMatch = row.experience.match(/\d+/)
        if (expMatch) {
          experience = parseInt(expMatch[0])
        }
      }

      // Create provider profile
      const provider = await prisma.provider.create({
        data: {
          userId: user.id,
          name: row.name.trim(),
          category: row.category || 'General Services',
          location: row.area || 'Accra',
          phone: row.phone || '',
          whatsapp: row.whatsapp || row.phone || '',
          email: email,
          description: row.bio || `Professional ${row.category} service provider`,
          rating: rating,
          reviewCount: reviewCount,
          verified: verified,
          availability: row.availability || 'Available Now',
          hourlyRate: hourlyRate,
          bio: row.bio || '',
          experience: experience,
          skills: specializations.length > 0 ? specializations : (services.length > 0 ? services : []),
          certifications: row.certifications ? parseJSON(row.certifications) : [],
          avatar: row.profile_photo_url || row.profile_image || undefined,
        }
      })

      // Create services if available
      if (services.length > 0) {
        for (const serviceName of services.slice(0, 5)) { // Limit to 5 services
          if (serviceName && serviceName.trim()) {
            try {
              await prisma.service.create({
                data: {
                  name: serviceName.trim().substring(0, 100),
                  category: row.category,
                  description: serviceName.trim(),
                  price: hourlyRate,
                  duration: 60,
                  providerId: provider.id,
                  isActive: true,
                }
              })
            } catch (e) {
              // Skip if service creation fails
            }
          }
        }
      }

      console.log(`✅ Created provider: ${provider.name} (${provider.category})`)
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
    console.error('❌ Fatal error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

