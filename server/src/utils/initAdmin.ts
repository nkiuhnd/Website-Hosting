import bcrypt from 'bcryptjs';
import prisma from '../prisma';

export const createDefaultAdmin = async () => {
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'hanshuai1987';

  try {
    const existingAdmin = await prisma.user.findFirst({
      where: { username: adminUsername }
    });

    if (!existingAdmin) {
      console.log('Creating default admin account...');
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      try {
        await prisma.user.create({
          data: {
            username: adminUsername,
            password: hashedPassword,
            role: 'ADMIN',
            status: 'ACTIVE'
          }
        });
        console.log(`Default admin created: ${adminUsername}`);
      } catch (createError: any) {
        // Handle race condition where user might be created between check and create
        if (createError.code === 'P2002') {
            console.log('Admin account already exists (race condition handled).');
        } else {
            throw createError;
        }
      }
    } else {
      // Optional: Ensure the existing admin has ADMIN role
      if (existingAdmin.role !== 'ADMIN') {
        console.log('Updating existing admin user to ADMIN role...');
        await prisma.user.update({
          where: { id: existingAdmin.id },
          data: { role: 'ADMIN' }
        });
      }
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};
