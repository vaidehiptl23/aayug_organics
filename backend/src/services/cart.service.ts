import { CartRepository } from '../repositories/cart.repository';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { NotFoundError, BadRequestError } from '../utils/appError';
import { CartTotals } from '../types';

export class CartService {
  private cartRepo = new CartRepository();

  async getCart(userId: string) {
    const cart = await this.cartRepo.findByUserId(userId);
    if (!cart) return { items: [], totals: this.calculateTotals([]) };

    const totals = this.calculateTotals(
      cart.items.map((item) => ({
        price: Number(item.product.discountPrice ?? item.product.price),
        quantity: item.quantity,
      })),
    );

    return { cart, totals };
  }

  async addToCart(userId: string, productId: string, quantity: number) {
    const product = await prisma.product.findFirst({
      where: { id: productId, status: 'ACTIVE', deletedAt: null },
    });
    if (!product) throw new NotFoundError('Product');
    if (product.stockQuantity < quantity) {
      throw new BadRequestError(`Only ${product.stockQuantity} units available`);
    }

    const cart = await this.cartRepo.upsertCart(userId);
    return this.cartRepo.addItem(cart.id, productId, quantity);
  }

  async updateCartItem(userId: string, productId: string, quantity: number) {
    const cart = await this.cartRepo.findByUserId(userId);
    if (!cart) throw new NotFoundError('Cart');

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundError('Product');
    if (product.stockQuantity < quantity) {
      throw new BadRequestError(`Only ${product.stockQuantity} units available`);
    }

    return this.cartRepo.updateItem(cart.id, productId, quantity);
  }

  async removeFromCart(userId: string, productId: string) {
    const cart = await this.cartRepo.findByUserId(userId);
    if (!cart) throw new NotFoundError('Cart');
    return this.cartRepo.removeItem(cart.id, productId);
  }

  async clearCart(userId: string) {
    const cart = await this.cartRepo.findByUserId(userId);
    if (cart) await this.cartRepo.clearCart(cart.id);
  }

  calculateTotals(
    items: { price: number; quantity: number }[],
    discountAmount = 0,
  ): CartTotals {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const afterDiscount = subtotal - discountAmount;
    const shippingCharge = afterDiscount >= env.FREE_SHIPPING_THRESHOLD ? 0 : env.SHIPPING_CHARGE;
    const taxAmount = parseFloat((afterDiscount * env.TAX_RATE).toFixed(2));
    const grandTotal = parseFloat((afterDiscount + shippingCharge + taxAmount).toFixed(2));

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      shippingCharge,
      taxAmount,
      grandTotal,
    };
  }
}
