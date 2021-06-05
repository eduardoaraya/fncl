import importCsvData from "../modules/Core/Import/import-csv-data.js";
import path from "path";
import Config from "../../config.js";
import CategoryRepository, { generateTag, generateName } from '../modules/Category/repository.js';
import ExpenseRepository from '../modules/Expense/repository.js';

let data = await importCsvData({
  importPath: path.resolve(Config.basePath, 'var', 'import')
});

data = await Promise.all(data);
data = data.map(factory);
data.forEach(parseAmountToInt);
data.forEach(generateCategories);
const insertList = data.map(generateExpenses);
Promise.all(insertList)
  .then(console.log)
  .catch(console.log)

async function generateExpenses(data) {
  const rows = await Promise.all(data.map(async row => {
    const date = getTimestamp();
    const tag = generateTag(generateName(row.category));
    const {
      rowCount,
      rows
    } = await CategoryRepository.find('id', `tag = '${tag}'`).execute();
    row.category = rowCount !== 0 ? rows[0].id : new Error("Invalid category by tag:" + tag);
    return Promise.resolve([
      `'${row.category}'`,
      `'${row.amount}'`,
      `'${row.title}'`,
      `'${row.date}'`,
      `'${date.created_at}'`,
      `'${date.updated_at}'`,
    ])
  }));
  return ExpenseRepository.save([
    'category_id',
    'value',
    'title',
    'date',
    'created_at',
    'updated_at'
  ], rows).execute();
}

function getTimestamp() {
  let date = new Date();
  date = date.getFullYear() + "-" + ((date.getMonth() + 1)) + "-" + ((date.getDate()));
  return {
    created_at: date,
    updated_at: date,
  }
}
async function generateCategories() {
  const queue = data.map(async current => {
    let dataCategory = await current.reduce(async (reducer, row) => {
      let categoryName = row.category;
      let date = getTimestamp();
      categoryName = generateName(categoryName);
      const tag = generateTag(categoryName);
      const {
        rowCount
      } = await CategoryRepository.find('id', `tag = '${tag}'`).execute();
      if (rowCount !== 0) return reducer;
      reducer[tag] = [`'${categoryName}'`, `'${tag}'`, `'${date.created_at}'`, `'${date.updated_at}'`];
      return reducer;
    }, {});
    dataCategory = Object.values(dataCategory);
    console.log(dataCategory);
    return dataCategory.length && CategoryRepository.save([
      'name',
      'tag',
      'created_at',
      'updated_at'
    ], dataCategory).execute();
  });
  return Promise.all(queue);
}

function factory(data) {
  const head = data.shift();
  return data.map(row => {
    return row.reduce((reducer, current, index) => {
      reducer[head[index]] = current;
      return reducer;
    }, {})
  })
}

function parseAmountToInt(data) {
  data.forEach(row => {
    let amount = parseFloat(row.amount);
    amount *= 100;
    row.amount = parseInt(amount);
  })
}
