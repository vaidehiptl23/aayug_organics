import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendCreated } from '../utils/apiResponse';
import { getFileUrl } from '../middlewares/upload';

const categoryService = new CategoryService();

export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  const categories = await categoryService.getAllCategories();
  sendSuccess(res, categories);
};

export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  const category = await categoryService.getCategoryById(req.params.id);
  sendSuccess(res, category);
};

export const getCategoryBySlug = async (req: Request, res: Response): Promise<void> => {
  const category = await categoryService.getCategoryBySlug(req.params.slug);
  sendSuccess(res, category);
};

export const createCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const imageUrl = req.file ? getFileUrl(req, 'categories', req.file.filename) : undefined;
  const category = await categoryService.createCategory(req.body, imageUrl);
  sendCreated(res, category, 'Category created');
};

export const updateCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const imageUrl = req.file ? getFileUrl(req, 'categories', req.file.filename) : undefined;
  const category = await categoryService.updateCategory(req.params.id, req.body, imageUrl);
  sendSuccess(res, category, 'Category updated');
};

export const deleteCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await categoryService.deleteCategory(req.params.id);
  sendSuccess(res, null, 'Category deleted');
};
