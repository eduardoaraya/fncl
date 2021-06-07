import Model from './model.js';
const CategoryModel = Model();
export default {
  list: (condition = null) => {
    return CategoryModel.find('*', condition);
  },
  find: (fields, condition) => {
    return CategoryModel.find(fields, condition);
  },
  save: (fields, values) => {
    return CategoryModel.insert(fields, values);
  }
}