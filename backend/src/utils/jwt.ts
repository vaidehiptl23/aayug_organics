import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface EmailTokenPayload {
  userId: string;
  email: string;
  purpose: 'verify' | 'reset';
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRY,
  } as SignOptions);
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRY,
  } as SignOptions);
}

export function signEmailToken(payload: EmailTokenPayload): string {
  const secret =
    payload.purpose === 'verify' ? env.JWT_EMAIL_SECRET : env.JWT_RESET_SECRET;
  const expiry =
    payload.purpose === 'verify' ? env.JWT_EMAIL_EXPIRY : env.JWT_RESET_EXPIRY;
  return jwt.sign(payload, secret, { expiresIn: expiry } as SignOptions);
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
}

export function verifyEmailToken(token: string, purpose: 'verify' | 'reset'): EmailTokenPayload {
  const secret = purpose === 'verify' ? env.JWT_EMAIL_SECRET : env.JWT_RESET_SECRET;
  return jwt.verify(token, secret) as EmailTokenPayload;
}
