
import prisma from './src/prisma';

async function main() {
  const username = process.argv[2];
  if (!username) {
    console.error('Please provide a username to make admin. Usage: npx ts-node make_admin.ts <username>');
    process.exit(1);
  }

  try {
    const user = await prisma.user.update({
      where: { username },
      data: { role: 'ADMIN' }
    });
    console.log(`User ${user.username} is now an ADMIN.`);
  } catch (error) {
    console.error(`User ${username} not found or error updating.`);
  }
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
