import { getPublicPrismaClient } from '../app/lib/prisma.ts';

async function main() {
  const prisma = getPublicPrismaClient();
  console.log('Starting cleanup...');

  try {
    const tenants = await prisma.tenant.findMany();
    if (tenants.length > 0) {
      console.log(`Found ${tenants.length} tenants to clean up.`);
      for (const tenant of tenants) {
        console.log(`- Dropping schema for tenant: ${tenant.name} (${tenant.schemaName})`);
        await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS \"${tenant.schemaName}\" CASCADE;`);
        console.log(`  Schema \"${tenant.schemaName}\" dropped.`);
      }

      console.log('Deleting all records from tenant table...');
      await prisma.tenant.deleteMany({});
      console.log('Tenant records deleted.');
    } else {
      console.log('No tenants found to clean up.');
    }

    console.log('🚀 Cleanup complete.');
  } catch (error) {
    console.error('❌ An error occurred during cleanup:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
