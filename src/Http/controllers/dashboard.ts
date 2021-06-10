import expenseRepository from '../../modules/Expense/repository';
import profitRepository from '../../modules/Profit/repository';
import { Request, Response } from 'express';

export default function dashboardController() {
  async function expenseToJson(req: Request, res: Response) {
    const { rows } = await expenseRepository.getAllToBoard().execute();
    res.status(200).json({ result: rows });
  }
  return {
    expenseToJson
  }
}