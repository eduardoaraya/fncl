import model from './model.js';

const ProfitModel = model();

export default {
  list: (condition = null) => {
    return ProfitModel.find('*', condition);
  },
  find: (fields, condition) => {
    return ProfitModel.find(fields, condition);
  },
  save: (fields, values) => {
    return ProfitModel.insert(fields, values);
  },
  getAll: function () {
    return ProfitModel.queryRow(`
      SELECT main_table.* FROM ${ProfitModel.table} as main_table
    `);
  },
  getTotal: function () {
    return ProfitModel.queryRow(`
      SELECT sum(value) as total FROM ${ProfitModel.table} WHERE value > 0`);
  }
}