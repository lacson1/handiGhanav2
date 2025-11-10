// Quick script to check provider setup
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProviders() {
  try {
    const providers = await prisma.provider.findMany({
      include: {
        user: {
          select: { id: true, email: true, name: true, role: true }
        }
      }
    });
    
    console.log('\n=== Current Providers in Database ===');
    console.log(`Total providers: ${providers.length}\n`);
    
    providers.forEach(p => {
      console.log(`Provider ID: ${p.id}`);
      console.log(`User ID: ${p.userId}`);
      console.log(`Name: ${p.name}`);
      console.log(`Email: ${p.user.email}`);
      console.log(`Role: ${p.user.role}`);
      console.log(`Verified: ${p.verified}`);
      console.log('---');
    });
    
    const users = await prisma.user.findMany({
      where: { role: 'PROVIDER' }
    });
    
    console.log(`\n=== Users with PROVIDER role ===`);
    console.log(`Total: ${users.length}\n`);
    
    users.forEach(u => {
      const hasProvider = providers.find(p => p.userId === u.id);
      console.log(`User ID: ${u.id}`);
      console.log(`Email: ${u.email}`);
      console.log(`Name: ${u.name}`);
      console.log(`Has Provider Record: ${hasProvider ? 'YES' : 'NO'}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProviders();
