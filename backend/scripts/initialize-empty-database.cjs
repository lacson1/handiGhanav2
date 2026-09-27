const { PrismaClient } = require('@prisma/client')
const { execFileSync } = require('node:child_process')

async function initialize() {
  const prisma = new PrismaClient()
  let empty
  try {
    const tables = await prisma.$queryRaw`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    `
    empty = tables.length === 0
  } finally {
    await prisma.$disconnect()
  }
  if (!empty) {
    console.log('Existing database detected; automatic schema initialization skipped.')
    return
  }
  console.log('Initializing the new empty database. No sample accounts will be created.')
  execFileSync('npx', ['prisma', 'db', 'push', '--skip-generate'], { stdio: 'inherit' })
}
initialize().catch(() => {
  console.error('Database initialization failed. Verify the connection and schema in Render before retrying.')
  process.exitCode = 1
})
