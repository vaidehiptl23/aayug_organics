import { UserRepository } from '../repositories/user.repository';
import { prisma } from '../config/database';
import { deleteCache, CACHE_KEYS } from '../config/redis';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/appError';
import { omitFields, getPaginationParams } from '../utils/helpers';

export class UserService {
  private userRepo = new UserRepository();

  async getProfile(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundError('User');
    return omitFields(user, ['password', 'emailVerifyToken', 'emailVerifyExpiry']);
  }

  async updateProfile(userId: string, data: { firstName?: string; lastName?: string; phone?: string }) {
    const user = await this.userRepo.update(userId, data);
    await deleteCache(CACHE_KEYS.USER(userId));
    return omitFields(user, ['password', 'emailVerifyToken', 'emailVerifyExpiry']);
  }

  async updateProfileImage(userId: string, imageUrl: string) {
    const user = await this.userRepo.update(userId, { profileImage: imageUrl });
    await deleteCache(CACHE_KEYS.USER(userId));
    return omitFields(user, ['password', 'emailVerifyToken', 'emailVerifyExpiry']);
  }

  async deleteAccount(userId: string) {
    await this.userRepo.softDelete(userId);
    await prisma.refreshToken.updateMany({ where: { userId }, data: { isRevoked: true } });
    await deleteCache(CACHE_KEYS.USER(userId));
  }

  // Addresses
  async getAddresses(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async addAddress(userId: string, data: {
    fullName: string; phone: string; addressLine1: string;
    addressLine2?: string; city: string; state: string;
    postalCode: string; country?: string; isDefault?: boolean;
  }) {
    if (data.isDefault) {
      await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }
    return prisma.address.create({ data: { ...data, userId } });
  }

  async updateAddress(userId: string, addressId: string, data: Partial<typeof this.addAddress>) {
    const address = await prisma.address.findFirst({ where: { id: addressId, userId } });
    if (!address) throw new NotFoundError('Address');

    if ((data as { isDefault?: boolean }).isDefault) {
      await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }

    return prisma.address.update({ where: { id: addressId }, data: data as object });
  }

  async deleteAddress(userId: string, addressId: string) {
    const address = await prisma.address.findFirst({ where: { id: addressId, userId } });
    if (!address) throw new NotFoundError('Address');
    await prisma.address.delete({ where: { id: addressId } });
  }

  async setDefaultAddress(userId: string, addressId: string) {
    const address = await prisma.address.findFirst({ where: { id: addressId, userId } });
    if (!address) throw new NotFoundError('Address');
    await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    return prisma.address.update({ where: { id: addressId }, data: { isDefault: true } });
  }

  // Admin
  async getAllUsers(page?: string, limit?: string, search?: string) {
    const { skip, take } = getPaginationParams(page, limit);
    return this.userRepo.findAll({ skip, take, search });
  }
}
