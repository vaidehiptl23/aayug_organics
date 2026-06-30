import { Prisma, User } from '@prisma/client';
import { prisma } from '../config/database';

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: { addresses: true },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findFirst({ where: { email, deletedAt: null } });
  }

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data });
  }

  async softDelete(id: string) {
    return prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    search?: string;
  }) {
    const where: Prisma.UserWhereInput = {
      deletedAt: null,
      ...(params.search && {
        OR: [
          { email: { contains: params.search, mode: 'insensitive' } },
          { firstName: { contains: params.search, mode: 'insensitive' } },
          { lastName: { contains: params.search, mode: 'insensitive' } },
        ],
      }),
    };

    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, email: true, firstName: true, lastName: true,
          phone: true, role: true, isEmailVerified: true,
          isActive: true, profileImage: true, createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total };
  }

  async countTotal() {
    return prisma.user.count({ where: { deletedAt: null } });
  }
}
