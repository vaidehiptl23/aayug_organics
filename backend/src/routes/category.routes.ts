import { Router } from 'express';
import 'express-async-errors';
import * as categoryController from '../controllers/category.controller';
import { authenticate, authorize } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import { productImageUpload } from '../middlewares/upload';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validator';

const router = Router();

router.get('/', categoryController.getAllCategories);
router.get('/slug/:slug', categoryController.getCategoryBySlug);
router.get('/:id', categoryController.getCategoryById);

router.post('/', authenticate, authorize('ADMIN'), productImageUpload.single('image'), validate(createCategorySchema), categoryController.createCategory);
router.patch('/:id', authenticate, authorize('ADMIN'), productImageUpload.single('image'), validate(updateCategorySchema), categoryController.updateCategory);
router.delete('/:id', authenticate, authorize('ADMIN'), categoryController.deleteCategory);

export default router;
