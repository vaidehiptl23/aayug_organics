import { Router } from 'express';
import 'express-async-errors';
import * as userController from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import { profileImageUpload } from '../middlewares/upload';
import { uploadRateLimiter } from '../middlewares/rateLimiter';
import { updateProfileSchema, addAddressSchema, updateAddressSchema } from '../validators/user.validator';

const router = Router();

router.use(authenticate);

router.get('/me', userController.getProfile);
router.patch('/me', validate(updateProfileSchema), userController.updateProfile);
router.post('/me/avatar', uploadRateLimiter, profileImageUpload.single('image'), userController.uploadProfileImage);
router.delete('/me', userController.deleteAccount);

// Addresses
router.get('/me/addresses', userController.getAddresses);
router.post('/me/addresses', validate(addAddressSchema), userController.addAddress);
router.patch('/me/addresses/:id', validate(updateAddressSchema), userController.updateAddress);
router.delete('/me/addresses/:id', userController.deleteAddress);
router.patch('/me/addresses/:id/default', userController.setDefaultAddress);

// Admin
router.get('/', authorize('ADMIN'), userController.getAllUsers);

export default router;
