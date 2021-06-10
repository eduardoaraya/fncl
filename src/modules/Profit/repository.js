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
  getAll: function () {
    return ExpenseModel.queryRow(`
      SELECT main_table.* FROM ${ExpenseModel.table} as main_table
    `);
  }
}