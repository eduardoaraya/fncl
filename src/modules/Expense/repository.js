import model from './model.js';
import categoryModel from '../Category/model.js';

const ExpenseModel = model();
const CategoryModel = categoryModel();

export default {
  list: (condition = null) => {
    return ExpenseModel.find('*', condition);
  },
  find: (fields, condition) => {
    return ExpenseModel.find(fields, condition);
  },
  save: (fields, values) => {
    return ExpenseModel.insert(fields, values);
  },
  getAllToBoard: function () {
    return ExpenseModel.queryRow(`
      SELECT main_table.*, cat.name FROM ${ExpenseModel.table} as main_table
        INNER JOIN ${CategoryModel.table} as cat 
        ON cat.id = main_table.category_id
    `);
  }
}