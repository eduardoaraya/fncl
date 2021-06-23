import { Router } from 'express';
import dashboardController from './controllers/dashboard';

export default function () {
  const router = Router();
  router.get('/chart/dashboard-expenses-profit', dashboardController().chartExpensesProfit);
  router.get('/chart/dashboard-expenses-categories', dashboardController().chartExpensesByCategory);
  router.get('/', dashboardController().index);
  return router;
}