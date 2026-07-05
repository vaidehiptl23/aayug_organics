import path from 'path';
import fs from 'fs';
import { ProductRepository } from '../repositories/product.repository';
import { prisma } from '../config/database';
import { getCache, setCache, deleteCache, deleteCachePattern, CACHE_KEYS, CACHE_TTL } from '../config/redis';
import { NotFoundError, BadRequestError, ConflictError } from '../utils/appError';
import { createSlug, generateSku } from '../utils/helpers';
import { ProductFilters } from '../types';

export class ProductService {
  private productRepo = new ProductRepository();

  async getAllProducts(filters: ProductFilters) {
    const cacheKey = `${CACHE_KEYS.PRODUCTS}:${JSON.stringify(filters)}`;
    const cached = await getCache(cacheKey);
    if (cached) return cached;

    const result = await this.productRepo.findAll(filters);
    await setCache(cacheKey, result, CACHE_TTL.MEDIUM);
    return result;
  }

  async getProductById(id: string) {
    const cacheKey = CACHE_KEYS.PRODUCT(id);
    const cached = await getCache(cacheKey);
    if (cached) return cached;

    const product = await this.productRepo.findById(id);
    if (!product) throw new NotFoundError('Product');

    await setCache(cacheKey, product, CACHE_TTL.LONG);
    return product;
  }

  async getProductBySlug(slug: string) {
    const product = await this.productRepo.findBySlug(slug);
    if (!product) throw new NotFoundError('Product');
    return product;
  }

  async createProduct(data: {
    name: string; description?: string; sku?: string; brand?: string;
    categoryId: string; price: number; discountPrice?: number;
    stockQuantity?: number; isFeatured?: boolean; badge?: string;
    weight?: number; weightUnit?: string;
  }) {
    const slug = createSlug(data.name);

    const existing = await prisma.product.findFirst({ where: { slug } });
    if (existing) throw new ConflictError('A product with this name already exists');

    const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!category) throw new NotFoundError('Category');

    const sku = data.sku || generateSku(data.name, category.name);

    const skuExists = await prisma.product.findFirst({ where: { sku } });
    if (skuExists) throw new ConflictError('SKU already in use');

    const product = await this.productRepo.create({
      ...data,
      slug,
      sku,
      category: { connect: { id: data.categoryId } },
      price: data.price,
      discountPrice: data.discountPrice,
    });

    await deleteCachePattern(`${CACHE_KEYS.PRODUCTS}*`);
    return product;
  }

  async updateProduct(id: string, data: Partial<{
    name: string; description: string; brand: string; categoryId: string;
    price: number; discountPrice: number | null; stockQuantity: number;
    status: string; isFeatured: boolean; badge: string | null;
    weight: number; weightUnit: string;
  }>) {
    const product = await this.productRepo.findById(id);
    if (!product) throw new NotFoundError('Product');

    const updateData: Record<string, unknown> = { ...data };

    if (data.name && data.name !== product.name) {
      updateData.slug = createSlug(data.name);
    }

    if (data.categoryId) {
      const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
      if (!category) throw new NotFoundError('Category');
      updateData.category = { connect: { id: data.categoryId } };
      delete updateData.categoryId;
    }

    const updated = await this.productRepo.update(id, updateData);
    await deleteCache(CACHE_KEYS.PRODUCT(id));
    await deleteCachePattern(`${CACHE_KEYS.PRODUCTS}*`);
    return updated;
  }

  async deleteProduct(id: string) {
    const product = await this.productRepo.findById(id);
    if (!product) throw new NotFoundError('Product');
    await this.productRepo.softDelete(id);
    await deleteCache(CACHE_KEYS.PRODUCT(id));
    await deleteCachePattern(`${CACHE_KEYS.PRODUCTS}*`);
  }

  async addProductImages(productId: string, files: Express.Multer.File[], baseUrl: string) {
    const product = await this.productRepo.findById(productId);
    if (!product) throw new NotFoundError('Product');

    const hasPrimary = product.images.some((img) => img.isPrimary);
    const images = files.map((file, index) => ({
      productId,
      url: `${baseUrl}/uploads/products/${file.filename}`,
      isPrimary: !hasPrimary && index === 0,
      sortOrder: product.images.length + index,
    }));

    await prisma.productImage.createMany({ data: images });
    await deleteCache(CACHE_KEYS.PRODUCT(productId));
    await deleteCachePattern(`${CACHE_KEYS.PRODUCTS}*`);
    return this.productRepo.findById(productId);
  }

  async deleteProductImage(productId: string, imageId: string) {
    const image = await prisma.productImage.findFirst({
      where: { id: imageId, productId },
    });
    if (!image) throw new NotFoundError('Image');

    // Delete physical file
    try {
      const filePath = path.resolve(process.cwd(), 'uploads/products', path.basename(image.url));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch { /* ignore file deletion errors */ }

    await prisma.productImage.delete({ where: { id: imageId } });
    await deleteCache(CACHE_KEYS.PRODUCT(productId));
  }

  async setPrimaryProductImage(productId: string, imageId: string) {
    const image = await prisma.productImage.findFirst({
      where: { id: imageId, productId },
    });
    if (!image) throw new NotFoundError('Image');

    await prisma.$transaction([
      prisma.productImage.updateMany({
        where: { productId },
        data: { isPrimary: false },
      }),
      prisma.productImage.update({
        where: { id: imageId },
        data: { isPrimary: true },
      }),
    ]);

    await deleteCache(CACHE_KEYS.PRODUCT(productId));
    return this.productRepo.findById(productId);
  }

  async adjustInventory(productId: string, change: number, reason: string) {
    const product = await this.productRepo.findById(productId);
    if (!product) throw new NotFoundError('Product');

    const newQty = product.stockQuantity + change;
    if (newQty < 0) throw new BadRequestError('Insufficient stock for this adjustment');

    await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: { stockQuantity: newQty, status: newQty === 0 ? 'OUT_OF_STOCK' : 'ACTIVE' },
      }),
      prisma.inventoryLog.create({
        data: { productId, change, reason, balanceAfter: newQty },
      }),
    ]);

    await deleteCache(CACHE_KEYS.PRODUCT(productId));
    return this.productRepo.findById(productId);
  }

  async getLowStockAlerts() {
    return this.productRepo.getLowStockProducts();
  }
}
