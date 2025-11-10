const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const providers = await prisma.provider.findMany({
    orderBy: { createdAt: 'desc' }
  })
  
  console.log(`\n📊 Total providers in database: ${providers.length}\n`)
  
  providers.forEach((p, i) => {
    console.log(`${i+1}. ${p.name} (${p.category}) - ${p.location}`)
    console.log(`   Created: ${p.createdAt}`)
    console.log(`   Verified: ${p.verified}`)
    console.log('')
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

