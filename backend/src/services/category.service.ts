import { prisma } from '../config/database';
import { getCache, setCache, deleteCache, deleteCachePattern, CACHE_KEYS, CACHE_TTL } from '../config/redis';
import { NotFoundError, ConflictError } from '../utils/appError';
import { createSlug } from '../utils/helpers';

export class CategoryService {
  async getAllCategories(activeOnly = true) {
    const cacheKey = CACHE_KEYS.CATEGORIES;
    const cached = await getCache(cacheKey);
    if (cached) return cached;

    const categories = await prisma.category.findMany({
      where: { ...(activeOnly && { isActive: true }), parentId: null },
      include: {
        children: {
          where: { ...(activeOnly && { isActive: true }) },
          include: { children: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    await setCache(cacheKey, categories, CACHE_TTL.LONG);
    return categories;
  }

  async getCategoryById(id: string) {
    const cached = await getCache(CACHE_KEYS.CATEGORY(id));
    if (cached) return cached;

    const category = await prisma.category.findUnique({
      where: { id },
      include: { children: true, parent: true },
    });
    if (!category) throw new NotFoundError('Category');

    await setCache(CACHE_KEYS.CATEGORY(id), category, CACHE_TTL.LONG);
    return category;
  }

  async getCategoryBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: { children: true },
    });
    if (!category) throw new NotFoundError('Category');
    return category;
  }

  async createCategory(data: {
    name: string; description?: string; parentId?: string;
    isActive?: boolean; sortOrder?: number;
  }, imageUrl?: string) {
    const slug = createSlug(data.name);
    const existing = await prisma.category.findFirst({ where: { OR: [{ name: data.name }, { slug }] } });
    if (existing) throw new ConflictError('Category with this name already exists');

    const category = await prisma.category.create({
      data: { ...data, slug, image: imageUrl },
    });
    await deleteCachePattern(`${CACHE_KEYS.CATEGORIES}*`);
    return category;
  }

  async updateCategory(id: string, data: {
    name?: string; description?: string; parentId?: string | null;
    isActive?: boolean; sortOrder?: number;
  }, imageUrl?: string) {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundError('Category');

    const updateData: Record<string, unknown> = { ...data };
    if (data.name && data.name !== category.name) {
      updateData.slug = createSlug(data.name);
    }
    if (imageUrl) updateData.image = imageUrl;

    const updated = await prisma.category.update({ where: { id }, data: updateData });
    await deleteCache(CACHE_KEYS.CATEGORY(id));
    await deleteCachePattern(`${CACHE_KEYS.CATEGORIES}*`);
    return updated;
  }

  async deleteCategory(id: string) {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundError('Category');

    const productCount = await prisma.product.count({ where: { categoryId: id, deletedAt: null } });
    if (productCount > 0) {
      throw new ConflictError(`Cannot delete category: ${productCount} product(s) are assigned to it`);
    }

    await prisma.category.delete({ where: { id } });
    await deleteCache(CACHE_KEYS.CATEGORY(id));
    await deleteCachePattern(`${CACHE_KEYS.CATEGORIES}*`);
  }
}
