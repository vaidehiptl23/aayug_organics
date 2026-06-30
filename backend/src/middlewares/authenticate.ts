import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifyAccessToken } from '../utils/jwt';
import { AuthenticatedRequest } from '../types';
import { prisma } from '../config/database';
import { Role } from '@prisma/client';

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: 'No token provided' });
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await prisma.user.findFirst({
      where: { id: payload.userId, isActive: true, deletedAt: null },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: 'User not found or inactive' });
      return;
    }

    req.user = { userId: user.id, email: user.email, role: user.role };
    next();
  } catch {
    res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: 'Invalid or expired token' });
  }
}

export function authorize(...roles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: 'Not authenticated' });
      return;
    }
    if (!roles.includes(req.user.role as Role)) {
      res.status(StatusCodes.FORBIDDEN).json({ success: false, message: 'Insufficient permissions' });
      return;
    }
    next();
  };
}
