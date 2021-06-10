import { Router } from 'express';
import dashboardController from './controllers/dashboard';

export default function () {
  const router = Router();
  router.get('/', dashboardController().expenseToJson);
  return router;
}