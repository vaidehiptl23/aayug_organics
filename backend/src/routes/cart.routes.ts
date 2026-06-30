import { Router } from 'express';
import 'express-async-errors';
import * as cartController from '../controllers/cart.controller';
import { authenticate } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import { addToCartSchema, updateCartItemSchema } from '../validators/cart.validator';

const router = Router();

router.use(authenticate);

router.get('/', cartController.getCart);
router.post('/', validate(addToCartSchema), cartController.addToCart);
router.patch('/:productId', validate(updateCartItemSchema), cartController.updateCartItem);
router.delete('/:productId', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

export default router;
