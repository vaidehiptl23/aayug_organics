import { Router } from 'express';
import 'express-async-errors';
import * as productController from '../controllers/product.controller';
import { authenticate, authorize } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import { productImageUpload } from '../middlewares/upload';
import { uploadRateLimiter } from '../middlewares/rateLimiter';
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
  adjustInventorySchema,
} from '../validators/product.validator';

const router = Router();

// Public
router.get('/', validate(productQuerySchema), productController.getAllProducts);
router.get('/slug/:slug', productController.getProductBySlug);
router.get('/:id', productController.getProductById);

// Reviews (public)
import * as reviewController from '../controllers/review.controller';
router.get('/:productId/reviews', reviewController.getProductReviews);

// Authenticated customers
router.post('/:productId/reviews', authenticate, reviewController.createReview);

// Admin only
router.post('/', authenticate, authorize('ADMIN'), validate(createProductSchema), productController.createProduct);
router.patch('/:id', authenticate, authorize('ADMIN'), validate(updateProductSchema), productController.updateProduct);
router.delete('/:id', authenticate, authorize('ADMIN'), productController.deleteProduct);
router.post(
  '/:id/images',
  authenticate,
  authorize('ADMIN'),
  uploadRateLimiter,
  productImageUpload.array('images', 8),
  productController.uploadProductImages,
);
router.delete('/:id/images/:imageId', authenticate, authorize('ADMIN'), productController.deleteProductImage);
router.post('/:id/inventory', authenticate, authorize('ADMIN'), validate(adjustInventorySchema), productController.adjustInventory);
router.get('/admin/low-stock', authenticate, authorize('ADMIN'), productController.getLowStockAlerts);

export default router;
