const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')
const csvParser = require('csv-parser')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting to seed providers from CSV...')

  const csvFilePath = path.join(__dirname, '../../service_providers.csv')

  if (!fs.existsSync(csvFilePath)) {
    console.error('❌ CSV file not found at:', csvFilePath)
    console.log('Please place service_providers.csv in the project root directory')
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

  // Clear existing providers (optional - comment out if you want to keep existing data)
  console.log('🗑️  Clearing existing providers...')
  await prisma.provider.deleteMany({})

  // Create admin user if doesn't exist
  let adminUser = await prisma.user.findFirst({
    where: { email: 'admin@handyghana.com' }
  })

  if (!adminUser) {
    console.log('👤 Creating admin user...')
    adminUser = await prisma.user.create({
      data: {
        email: 'admin@handyghana.com',
        password: '$2b$10$X7qH8YJc8QZ5fYZvT9xGxOL1Y0K1nP8fQ3mZ9vN8pL2xK5wM4rN6m', // "admin123"
        name: 'Admin User',
        role: 'ADMIN',
      }
    })
  }

  // Insert providers from CSV
  console.log('📝 Inserting providers...')
  let successCount = 0
  let errorCount = 0

  for (const row of providers) {
    try {
      // Create user for each provider
      const email = row.email || `${row.name.toLowerCase().replace(/\s+/g, '.')}@handyghana.com`
      
      let user = await prisma.user.findUnique({
        where: { email }
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            password: '$2b$10$X7qH8YJc8QZ5fYZvT9xGxOL1Y0K1nP8fQ3mZ9vN8pL2xK5wM4rN6m', // Default: "password123"
            name: row.name,
            role: 'PROVIDER',
          }
        })
      }

      // Create provider profile
      const provider = await prisma.provider.create({
        data: {
          userId: user.id,
          name: row.name,
          category: row.category || 'General Services',
          location: row.location || 'Accra, Ghana',
          phone: row.phone || '',
          whatsapp: row.whatsapp || row.phone || '',
          email: email,
          description: row.description || row.bio || `Professional ${row.category} service provider`,
          rating: parseFloat(row.rating || '4.5'),
          reviewCount: Math.floor(Math.random() * 50) + 10,
          verified: row.verified === 'true' || row.verified === '1' || Math.random() > 0.3,
          availability: row.availability || 'Available Now',
          hourlyRate: parseFloat(row.hourlyRate || '50'),
          bio: row.bio || row.description || `Experienced ${row.category} professional`,
          experience: parseInt(row.experience || '5'),
          skills: row.skills ? row.skills.split(',').map(s => s.trim()) : [],
          certifications: row.certifications ? row.certifications.split(',').map(s => s.trim()) : [],
        }
      })

      console.log(`✅ Created provider: ${provider.name}`)
      successCount++
    } catch (error) {
      console.error(`❌ Error creating provider ${row.name}:`, error.message)
      errorCount++
    }
  }

  console.log('\n📊 Seeding Summary:')
  console.log(`   ✅ Successfully created: ${successCount} providers`)
  console.log(`   ❌ Errors: ${errorCount}`)
  console.log('\n🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Fatal error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

