import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('3000'),
  API_PREFIX: z.string().default('/api/v1'),
  FRONTEND_URL: z.string().default('http://localhost:8000'),

  DATABASE_URL: z.string(),

  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().default('6379'),
  REDIS_PASSWORD: z.string().default(''),
  REDIS_DB: z.string().default('0'),

  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),
  JWT_EMAIL_SECRET: z.string(),
  JWT_EMAIL_EXPIRY: z.string().default('24h'),
  JWT_RESET_SECRET: z.string(),
  JWT_RESET_EXPIRY: z.string().default('1h'),

  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.string().default('587'),
  SMTP_SECURE: z.string().default('false'),
  SMTP_USER: z.string().default(''),
  SMTP_PASS: z.string().default(''),
  EMAIL_FROM: z.string().default('Aayug Organics <noreply@aayugorganics.com>'),

  UPLOAD_DIR: z.string().default('uploads'),
  MAX_FILE_SIZE: z.string().default('5242880'),

  RAZORPAY_KEY_ID: z.string().default(''),
  RAZORPAY_KEY_SECRET: z.string().default(''),
  RAZORPAY_WEBHOOK_SECRET: z.string().default(''),

  PAYU_MERCHANT_KEY: z.string().default(''),
  PAYU_MERCHANT_SALT: z.string().default(''),
  PAYU_BASE_URL: z.string().default('https://test.payu.in'),

  CASHFREE_APP_ID: z.string().default(''),
  CASHFREE_SECRET_KEY: z.string().default(''),
  CASHFREE_BASE_URL: z.string().default('https://sandbox.cashfree.com'),

  RATE_LIMIT_WINDOW_MS: z.string().default('900000'),
  RATE_LIMIT_MAX: z.string().default('100'),
  AUTH_RATE_LIMIT_MAX: z.string().default('10'),

  LOG_LEVEL: z.string().default('info'),
  LOG_DIR: z.string().default('logs'),

  FREE_SHIPPING_THRESHOLD: z.string().default('999'),
  SHIPPING_CHARGE: z.string().default('99'),
  TAX_RATE: z.string().default('0.18'),
  BCRYPT_ROUNDS: z.string().default('12'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = {
  ...parsed.data,
  PORT: parseInt(parsed.data.PORT, 10),
  REDIS_PORT: parseInt(parsed.data.REDIS_PORT, 10),
  REDIS_DB: parseInt(parsed.data.REDIS_DB, 10),
  SMTP_PORT: parseInt(parsed.data.SMTP_PORT, 10),
  SMTP_SECURE: parsed.data.SMTP_SECURE === 'true',
  MAX_FILE_SIZE: parseInt(parsed.data.MAX_FILE_SIZE, 10),
  RATE_LIMIT_WINDOW_MS: parseInt(parsed.data.RATE_LIMIT_WINDOW_MS, 10),
  RATE_LIMIT_MAX: parseInt(parsed.data.RATE_LIMIT_MAX, 10),
  AUTH_RATE_LIMIT_MAX: parseInt(parsed.data.AUTH_RATE_LIMIT_MAX, 10),
  FREE_SHIPPING_THRESHOLD: parseFloat(parsed.data.FREE_SHIPPING_THRESHOLD),
  SHIPPING_CHARGE: parseFloat(parsed.data.SHIPPING_CHARGE),
  TAX_RATE: parseFloat(parsed.data.TAX_RATE),
  BCRYPT_ROUNDS: parseInt(parsed.data.BCRYPT_ROUNDS, 10),
  IS_PRODUCTION: parsed.data.NODE_ENV === 'production',
  IS_TEST: parsed.data.NODE_ENV === 'test',
};
