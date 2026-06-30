import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─────────────────────────────────────────────
  // Admin User
  // ─────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@aayugorganics.com' },
    update: {},
    create: {
      email: 'admin@aayugorganics.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'Aayug',
      role: 'ADMIN',
      isEmailVerified: true,
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);

  // ─────────────────────────────────────────────
  // Demo Customer
  // ─────────────────────────────────────────────
  const customerPassword = await bcrypt.hash('Customer@123', 12);
  const customer = await prisma.user.upsert({
    where: { email: 'rahul@example.com' },
    update: {},
    create: {
      email: 'rahul@example.com',
      password: customerPassword,
      firstName: 'Rahul',
      lastName: 'Sharma',
      phone: '9876543210',
      role: 'CUSTOMER',
      isEmailVerified: true,
    },
  });
  console.log(`✅ Demo customer: ${customer.email}`);

  // ─────────────────────────────────────────────
  // Categories
  // ─────────────────────────────────────────────
  const categories = [
    { name: 'Ghee', slug: 'ghee', description: 'Pure A2 cow ghee and buffalo ghee products', sortOrder: 1 },
    { name: 'Honey', slug: 'honey', description: 'Raw and infused natural honey varieties', sortOrder: 2 },
    { name: 'Oils', slug: 'oils', description: 'Cold-pressed and wood-pressed oils', sortOrder: 3 },
    { name: 'Spices', slug: 'spices', description: 'Stone-ground and organic spice blends', sortOrder: 4 },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories[cat.slug] = created.id;
    console.log(`✅ Category: ${cat.name}`);
  }

  // ─────────────────────────────────────────────
  // Products
  // ─────────────────────────────────────────────
  const products = [
    { name: 'A2 Gir Cow Ghee', slug: 'a2-gir-cow-ghee', sku: 'GHE-A2G-001', categorySlug: 'ghee', price: 699, discountPrice: null, originalPrice: 849, badge: 'Bestseller', stock: 50 },
    { name: 'Raw Forest Honey', slug: 'raw-forest-honey', sku: 'HON-RAW-001', categorySlug: 'honey', price: 549, discountPrice: null, originalPrice: 599, badge: 'Organic', stock: 35 },
    { name: 'Cold-Pressed Coconut Oil', slug: 'cold-pressed-coconut-oil', sku: 'OIL-COC-001', categorySlug: 'oils', price: 449, discountPrice: null, originalPrice: null, badge: 'New', stock: 40 },
    { name: 'Organic Turmeric Powder', slug: 'organic-turmeric-powder', sku: 'SPI-TUR-001', categorySlug: 'spices', price: 249, discountPrice: 249, originalPrice: 299, badge: '17% OFF', stock: 80 },
    { name: 'A2 Bilona Cow Ghee', slug: 'a2-bilona-cow-ghee', sku: 'GHE-BIL-001', categorySlug: 'ghee', price: 799, discountPrice: null, originalPrice: 899, badge: 'Bestseller', stock: 30 },
    { name: 'Wild Forest Honey', slug: 'wild-forest-honey', sku: 'HON-WLD-001', categorySlug: 'honey', price: 599, discountPrice: null, originalPrice: null, badge: 'Bestseller', stock: 25 },
    { name: 'Cold-Pressed Virgin Coconut Oil', slug: 'cold-pressed-virgin-coconut-oil', sku: 'OIL-VCO-001', categorySlug: 'oils', price: 499, discountPrice: null, originalPrice: 549, badge: 'Bestseller', stock: 45 },
    { name: 'Lakadong Turmeric Powder', slug: 'lakadong-turmeric-powder', sku: 'SPI-LAK-001', categorySlug: 'spices', price: 349, discountPrice: null, originalPrice: 399, badge: 'Bestseller', stock: 60 },
  ];

  for (const p of products) {
    const existing = await prisma.product.findFirst({ where: { slug: p.slug } });
    if (!existing) {
      await prisma.product.create({
        data: {
          name: p.name,
          slug: p.slug,
          sku: p.sku,
          categoryId: createdCategories[p.categorySlug],
          price: p.price,
          discountPrice: p.discountPrice,
          stockQuantity: p.stock,
          badge: p.badge,
          status: 'ACTIVE',
          isFeatured: p.badge === 'Bestseller',
          description: `Premium quality ${p.name} from Aayug Organics. 100% pure, natural and organic.`,
        },
      });
      console.log(`✅ Product: ${p.name}`);
    }
  }

  // ─────────────────────────────────────────────
  // Sample Coupon
  // ─────────────────────────────────────────────
  await prisma.coupon.upsert({
    where: { code: 'ORGANIC10' },
    update: {},
    create: {
      code: 'ORGANIC10',
      type: 'PERCENTAGE',
      value: 10,
      minOrderAmount: 500,
      maxDiscountAmount: 200,
      usageLimit: 1000,
      perUserLimit: 3,
      isActive: true,
    },
  });
  console.log('✅ Coupon: ORGANIC10');

  await prisma.coupon.upsert({
    where: { code: 'WELCOME50' },
    update: {},
    create: {
      code: 'WELCOME50',
      type: 'FIXED',
      value: 50,
      minOrderAmount: 299,
      usageLimit: 500,
      perUserLimit: 1,
      isActive: true,
    },
  });
  console.log('✅ Coupon: WELCOME50');

  console.log('\n🎉 Seed completed successfully!');
  console.log('\nAdmin Login:');
  console.log('  Email:    admin@aayugorganics.com');
  console.log('  Password: Admin@123');
  console.log('\nCustomer Login:');
  console.log('  Email:    rahul@example.com');
  console.log('  Password: Customer@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
