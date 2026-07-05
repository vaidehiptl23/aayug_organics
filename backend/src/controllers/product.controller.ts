import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendCreated, buildPaginationMeta } from '../utils/apiResponse';

const productService = new ProductService();

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  const filters = req.query as Record<string, string>;
  const result = await productService.getAllProducts(filters) as { total: number; page: number; limit: number; products: unknown[] };
  const meta = buildPaginationMeta(result.total, result.page, result.limit);
  sendSuccess(res, result.products, 'Products retrieved', 200, meta);
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  const product = await productService.getProductById(req.params.id);
  sendSuccess(res, product);
};

export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  const product = await productService.getProductBySlug(req.params.slug);
  sendSuccess(res, product);
};

export const createProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const product = await productService.createProduct(req.body);
  sendCreated(res, product, 'Product created');
};

export const updateProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const product = await productService.updateProduct(req.params.id, req.body);
  sendSuccess(res, product, 'Product updated');
};

export const deleteProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await productService.deleteProduct(req.params.id);
  sendSuccess(res, null, 'Product deleted');
};

export const uploadProductImages = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const files = req.files as Express.Multer.File[];
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const product = await productService.addProductImages(req.params.id, files, baseUrl);
  sendSuccess(res, product, 'Images uploaded');
};

export const deleteProductImage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await productService.deleteProductImage(req.params.id, req.params.imageId);
  sendSuccess(res, null, 'Image deleted');
};

export const setPrimaryProductImage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const product = await productService.setPrimaryProductImage(req.params.id, req.params.imageId);
  sendSuccess(res, product, 'Primary image updated');
};

export const adjustInventory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const product = await productService.adjustInventory(
    req.params.id,
    req.body.change,
    req.body.reason,
  );
  sendSuccess(res, product, 'Inventory updated');
};

export const getLowStockAlerts = async (_req: Request, res: Response): Promise<void> => {
  const products = await productService.getLowStockAlerts();
  sendSuccess(res, products);
};
