import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Admin user ────────────────────────────────────────────
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
  console.log(`✅ Admin: ${admin.email}`);

  // ── Demo customer ─────────────────────────────────────────
  const customerPassword = await bcrypt.hash('Customer@123', 12);
  const customer = await prisma.user.upsert({
    where: { email: 'xyz@example.com' },
    update: {},
    create: {
      email: 'xyz@example.com',
      password: customerPassword,
      firstName: 'XYZ',
      lastName: 'Customer',
      phone: '9876543210',
      role: 'CUSTOMER',
      isEmailVerified: true,
    },
  });
  console.log(`✅ Customer: ${customer.email}`);

  // ── Categories ────────────────────────────────────────────
  const categoryData = [
    { name: 'Salt',  slug: 'salt',  description: 'Premium Himalayan Crystal Salt', sortOrder: 1 },
    { name: 'Honey', slug: 'honey', description: 'Raw unprocessed natural honey',  sortOrder: 2 },
    { name: 'Hing',  slug: 'hing',  description: 'Pure Asafoetida',                sortOrder: 3 },
    { name: 'Ghee',  slug: 'ghee',  description: 'Pure A2 Gir Cow Ghee',           sortOrder: 4 },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categoryData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories[cat.slug] = created.id;
    console.log(`✅ Category: ${cat.name}`);
  }

  // ── Products ──────────────────────────────────────────────
  const productData = [
    {
      name: 'Premium Himalayan Crystal Salt',
      slug: 'premium-himalayan-crystal-salt',
      sku: 'SAL-HIM-001',
      categorySlug: 'salt',
      price: 199,
      discountPrice: null,
      originalPrice: 249,
      stock: 100,
      badge: 'Bestseller',
      weight: '500',
      description: 'Harvested from ancient Himalayan salt mines. 100% pure, unrefined with 84+ natural trace minerals. A healthier alternative to processed table salt.',
    },
    {
      name: 'Raw Forest Honey',
      slug: 'raw-forest-honey',
      sku: 'HON-RAW-001',
      categorySlug: 'honey',
      price: 549,
      discountPrice: null,
      originalPrice: 649,
      stock: 75,
      badge: 'Organic',
      weight: '500',
      description: 'Pure raw honey from wild forest hives. Unheated, unfiltered, unpasteurised. Retains all natural enzymes, pollen and antioxidants.',
    },
    {
      name: 'Pure Hing (Asafoetida)',
      slug: 'pure-hing-asafoetida',
      sku: 'HNG-PUR-001',
      categorySlug: 'hing',
      price: 299,
      discountPrice: null,
      originalPrice: 349,
      stock: 60,
      badge: 'New',
      weight: '50',
      description: 'Finest quality Hing sourced from Afghanistan. Pure resin with no added starch or fillers. Powerful digestive and anti-bloating properties.',
    },
    {
      name: 'A2 Gir Cow Ghee',
      slug: 'a2-gir-cow-ghee',
      sku: 'GHE-A2G-001',
      categorySlug: 'ghee',
      price: 899,
      discountPrice: null,
      originalPrice: 1099,
      stock: 50,
      badge: 'Bestseller',
      weight: '500',
      description: 'Pure A2 Gir Cow Ghee made with traditional Vedic Bilona method. Hand-churned from curd of indigenous Gir cows. Rich in vitamins A, D, E, K and Omega-3.',
    },
  ];

  for (const p of productData) {
    const existing = await prisma.product.findFirst({ where: { slug: p.slug } });
    if (!existing) {
      const product = await prisma.product.create({
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
          isFeatured: true,
          description: p.description,
          weight: parseFloat(p.weight),
          weightUnit: p.categorySlug === 'hing' ? 'g' : p.categorySlug === 'ghee' ? 'ml' : 'g',
        },
      });
      // Add placeholder image
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: `https://placehold.co/600x600/1b4332/ffffff?text=${encodeURIComponent(p.name)}`,
          altText: p.name,
          isPrimary: true,
          sortOrder: 0,
        },
      });
      console.log(`✅ Product: ${p.name}`);
    } else {
      console.log(`⏭  Skipped (exists): ${p.name}`);
    }
  }

  // ── Coupons ───────────────────────────────────────────────
  await prisma.coupon.upsert({
    where: { code: 'ORGANIC10' },
    update: {},
    create: {
      code: 'ORGANIC10',
      type: 'PERCENTAGE',
      value: 10,
      minOrderAmount: 299,
      maxDiscountAmount: 150,
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

  console.log('\n🎉 Seed completed!');
  console.log('Admin:    admin@aayugorganics.com / Admin@123');
  console.log('Customer: xyz@example.com / Customer@123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
