import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { sendSuccess } from '../utils/apiResponse';

const dashboardService = new DashboardService();

export const getStats = async (req: Request, res: Response): Promise<void> => {
  const { startDate, endDate } = req.query as { startDate?: string; endDate?: string };
  const stats = await dashboardService.getStats(startDate, endDate);
  sendSuccess(res, stats);
};

export const getSalesReport = async (req: Request, res: Response): Promise<void> => {
  const { startDate, endDate } = req.query as { startDate: string; endDate: string };
  const report = await dashboardService.getSalesReport(startDate, endDate);
  sendSuccess(res, report);
};

export const getInventoryReport = async (_req: Request, res: Response): Promise<void> => {
  const report = await dashboardService.getInventoryReport();
  sendSuccess(res, report);
};

export const getTopProducts = async (_req: Request, res: Response): Promise<void> => {
  const products = await dashboardService.getTopProducts();
  sendSuccess(res, products);
};
