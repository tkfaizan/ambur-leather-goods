import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);

  await prisma.admin.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@amburleather.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@amburleather.com',
      password: adminPassword,
      name: 'Admin User',
    },
  });

  // Create default settings
  await prisma.setting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      businessName: 'AMBUR Leather Goods',
      whatsappNumber: '919629292165',
      businessPhone: '919629292165',
      email: 'contact@amburleather.com',
      address: 'Ambur, Tamil Nadu, India',
    },
  });

  // Create categories
  const categories = [
    { name: 'Slippers', slug: 'slippers', description: 'Premium leather slippers', sortOrder: 1 },
    { name: 'Sandals', slug: 'sandals', description: 'Handcrafted leather sandals', sortOrder: 2 },
    { name: 'Loafers', slug: 'loafers', description: 'Elegant leather loafers', sortOrder: 3 },
    { name: 'Shoes', slug: 'shoes', description: 'Formal leather shoes', sortOrder: 4 },
    { name: 'Belts', slug: 'belts', description: 'Genuine leather belts', sortOrder: 5 },
    { name: 'Wallets', slug: 'wallets', description: 'Leather wallets', sortOrder: 6 },
    { name: 'Bags', slug: 'bags', description: 'Leather bags and backpacks', sortOrder: 7 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
