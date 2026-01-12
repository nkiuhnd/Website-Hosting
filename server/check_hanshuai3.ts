
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkUser() {
  const id = '57b11e1f-6e8c-4379-a943-d272fea35bda';
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
