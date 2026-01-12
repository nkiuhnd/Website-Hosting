
import prisma from './src/prisma';

async function main() {
  const projects = await prisma.project.findMany();
  console.log(projects);
  const users = await prisma.user.findMany();
  console.log(users);
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
