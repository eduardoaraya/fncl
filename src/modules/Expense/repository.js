import Model from './model.js';
const ExpenseModel = Model();
export default {
  list: (condition = null) => {
    return ExpenseModel.find('*', condition);
  },
  find: (fields, condition) => {
    return ExpenseModel.find(fields, condition);
  },
  save: (fields, values) => {
    return ExpenseModel.insert(fields, values);
  }
}