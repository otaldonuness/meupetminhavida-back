import { PrismaClient } from '@prisma/client';
import locations = require('./seeds/location');

const prisma = new PrismaClient();
async function main() {
  await prisma.locations.createMany({
    data: locations.data,
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
