import expenseRepository from '../../modules/Expense/repository.js';

export default function dashboardController() {
  async function expenseToJson(req, res) {
    const { rows } = await expenseRepository.getAllToBoard().execute();
    return res.status(200).json({
      result: rows
    });
  }
  return {
    expenseToJson
  }
}