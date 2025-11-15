import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function makeAdmin(email: string) {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.error(`User with email ${email} not found`)
      process.exit(1)
    }

    // Update user role to ADMIN
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        role: 'ADMIN'
      }
    })

    console.log(`✅ Successfully updated ${email} to ADMIN role`)
    console.log(`User ID: ${updatedUser.id}`)
    console.log(`Name: ${updatedUser.name}`)
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
  console.error('Usage: npx tsx scripts/make-admin.ts <email>')
  process.exit(1)
}

makeAdmin(email)

