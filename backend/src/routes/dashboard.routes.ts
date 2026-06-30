import { Router } from 'express';
import 'express-async-errors';
import * as dashboardController from '../controllers/dashboard.controller';
import { authenticate, authorize } from '../middlewares/authenticate';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/stats', dashboardController.getStats);
router.get('/sales-report', dashboardController.getSalesReport);
router.get('/inventory-report', dashboardController.getInventoryReport);
router.get('/top-products', dashboardController.getTopProducts);

export default router;
