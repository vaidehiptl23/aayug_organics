import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/env';
import { AppError } from '../utils/appError';
import { StatusCodes } from 'http-status-codes';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function createStorage(subDir: string) {
  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      const uploadPath = path.resolve(process.cwd(), env.UPLOAD_DIR, subDir);
      ensureDir(uploadPath);
      cb(null, uploadPath);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${uuidv4()}${ext}`);
    },
  });
}

function fileFilter(_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only JPEG, PNG and WebP images are allowed', StatusCodes.BAD_REQUEST));
  }
}

export const productImageUpload = multer({
  storage: createStorage('products'),
  limits: { fileSize: env.MAX_FILE_SIZE },
  fileFilter,
});

export const profileImageUpload = multer({
  storage: createStorage('profiles'),
  limits: { fileSize: env.MAX_FILE_SIZE },
  fileFilter,
});

export function getFileUrl(req: Request, subDir: string, filename: string): string {
  return `${req.protocol}://${req.get('host')}/uploads/${subDir}/${filename}`;
}
