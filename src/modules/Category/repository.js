import Model from './model.js';

const CategoryModel = Model();

export const generateTag = (name) => {
  return name.toLowerCase().replace(/[ ]+/i, "_");
}

export const generateName = (name) => {
  return name == ""
    ? "Not defined"
    : name;
}

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