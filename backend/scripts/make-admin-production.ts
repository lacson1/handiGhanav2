import { PrismaClient } from '@prisma/client'

// Use production database URL from environment
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

async function makeAdmin(email: string) {
  try {
    console.log(`Looking for user with email: ${email}`)
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.error(`❌ User with email ${email} not found`)
      console.log('Available users:')
      const allUsers = await prisma.user.findMany({
        select: { email: true, name: true, role: true },
        take: 10
      })
      allUsers.forEach(u => console.log(`  - ${u.email} (${u.name}) - ${u.role}`))
      process.exit(1)
    }

    console.log(`Found user: ${user.name} (${user.email}) - Current role: ${user.role}`)

    // Update user role to ADMIN
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        role: 'ADMIN'
      }
    })

    console.log(`\n✅ Successfully updated ${email} to ADMIN role`)
    console.log(`User ID: ${updatedUser.id}`)
    console.log(`Name: ${updatedUser.name}`)
    console.log(`Email: ${updatedUser.email}`)
    console.log(`Role: ${updatedUser.role}`)
  } catch (error) {
    console.error('Error updating user:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Get email from command line argument
const email = process.argv[2]

if (!email) {
  console.error('Usage: DATABASE_URL=<prod-url> npx tsx scripts/make-admin-production.ts <email>')
  process.exit(1)
}

makeAdmin(email)

