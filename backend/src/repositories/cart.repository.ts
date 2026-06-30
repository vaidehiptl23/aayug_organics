import { prisma } from '../config/database';

const cartInclude = {
  items: {
    include: {
      product: {
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          category: { select: { name: true } },
        },
      },
    },
  },
};

export class CartRepository {
  async findByUserId(userId: string) {
    return prisma.cart.findUnique({ where: { userId }, include: cartInclude });
  }

  async upsertCart(userId: string) {
    return prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
      include: cartInclude,
    });
  }

  async addItem(cartId: string, productId: string, quantity: number) {
    await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId, productId } },
      create: { cartId, productId, quantity },
      update: { quantity: { increment: quantity } },
    });
    return prisma.cart.findUnique({ where: { id: cartId }, include: cartInclude });
  }

  async updateItem(cartId: string, productId: string, quantity: number) {
    await prisma.cartItem.update({
      where: { cartId_productId: { cartId, productId } },
      data: { quantity },
    });
    return prisma.cart.findUnique({ where: { id: cartId }, include: cartInclude });
  }

  async removeItem(cartId: string, productId: string) {
    await prisma.cartItem.delete({
      where: { cartId_productId: { cartId, productId } },
    });
    return prisma.cart.findUnique({ where: { id: cartId }, include: cartInclude });
  }

  async clearCart(cartId: string) {
    await prisma.cartItem.deleteMany({ where: { cartId } });
  }
}
