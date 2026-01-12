
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkUser() {
  const id = 'ed47b0a4-e534-4d5d-bd60-3bbb596b9e86';
  console.log(`Checking user ${id}...`);
  const user = await prisma.user.findUnique({ where: { id } });
  console.log('User found:', user);
  
  const allUsers = await prisma.user.findMany();
  console.log('Total users:', allUsers.length);
  console.log('All IDs:', allUsers.map(u => ({ id: u.id, username: u.username })));
}

checkUser()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
