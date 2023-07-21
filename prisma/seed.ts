import { PrismaClient } from "@prisma/client";
import { locations } from "./seeds/location";
import { species } from "./seeds/species";

const prisma = new PrismaClient();
async function main() {
  await prisma.locations.createMany({
    data: locations,
  });
  await prisma.species.createMany({
    data: species,
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
