import path from 'path';
import expenseRepository from '../../modules/Expense/repository';
import profitRepository from '../../modules/Profit/repository';
import { Request, Response } from 'express';
import Chart from '../../services/chart-builder';

export default function dashboardController() {
  async function chartExpensesProfit(req: Request, res: Response) {
    const { rows: [{ total: totalOfExpenses }] } = await expenseRepository.getTotal().execute();
    const { rows: [{ total: totalOfProfit }] } = await profitRepository.getTotal().execute();
    res.status(200).json({
      data: [
        totalOfExpenses,
        totalOfProfit
      ],
      chart: await Chart.chartFactory('bar', {
        chartData: {
          labels: ['Expenses', 'Profit'],
          datasets: [{
            label: ['Expenses', 'Profit'],
            data: [totalOfExpenses / 100, totalOfProfit / 100],
            backgroundColor: ['tomato', '#666'],
            borderColor: ['red', '#222'],
            borderWidth: 5
          }]
        },
        options: {
          scales: {
            x: {},
            y: {}
          }
        }
      })
    });
  }
  async function chartExpensesByCategory(req: Request, res: Response) {
    const { rows: Result } = await expenseRepository.getByCategories().execute();
    // log(Items);
    res.status(200).json({
      data: [
        Result
      ],
      chart: await Chart.chartFactory('bar', {
        chartData: {
          labels: Result.map((dt: any) => dt.name),
          datasets: [
            {
              data: Result.map((dt: any) => dt.total),
              label: '',
              backgroundColor: Result.map((dt: any, index: number) => `rgba(${index > 9 ? `13${index / 10}` : `12${index}`},230,230)`),
              borderColor: Result.map((dt: any, index: number) => `rgba(${index > 9 ? `13${index / 10}` : `12${index}`}, 230, 230)`),
              borderWidth: 5
            }
          ],
        },
        options: {
          scales: {
            x: {},
            y: {}
          }
        }
      })
    });
  }
  async function index(req: Request, res: Response) {
    res.sendFile(path.resolve('src/public/index.html'));
  }

  return {
    chartExpensesProfit,
    chartExpensesByCategory,
    index
  }
}