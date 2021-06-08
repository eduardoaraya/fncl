import importCsvData from "../modules/Core/Import/import-csv-data.js";
import path from "path";
import Config from "../../config.js";
import CategoryRepository, { generateTag, generateName } from '../modules/Category/repository.js';
import ExpenseRepository from '../modules/Expense/repository.js';
import ImportRepository from '../modules/Core/Import/repository.js';
import debug from 'debug';

const log = debug('app:import');

(async function () {
  log("> Import init");
  const excludeFiles = await ImportRepository.find('file').execute();
  const importedData = await importCsvData({
    importPath: path.resolve(Config.basePath, 'var', 'import', 'nubank_invoice'),
    excludes: excludeFiles.rows.map(({ file }) => file)
  });
  for (const content of generate(importedData)) {
    const data = await factory((await content.data));
    parseAmountToInt(data);
    await generateCategories(data);
    await generateExpenses(data);
    const {
      created_at,
      updated_at
    } = getTimestamp();
    await ImportRepository.save([
      'file',
      'created_at',
      'updated_at'
    ], `'${content.fileName}', '${created_at}', '${updated_at}'`).execute();

    log("> Importe successful!: %o", content.fileName);
  }
  log("> Total import:", Object.keys(importedData).length);
})();

function* generate(data) {
  let fileNames = Object.keys(data);
  while (fileNames.length > 0) {
    const fileName = fileNames.shift();
    yield {
      fileName: fileName,
      data: data[fileName]
    };
  }
}


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
  await ExpenseRepository.save([
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

async function generateCategories(data) {
  const dataCategory = [];
  const categories = data
    .map(item => item.category)
    .reduce((acc, current) => {
      const name = generateName(current);
      const tag = generateTag(name);
      acc[tag] = {
        tag,
        name
      };
      return acc;
    }, {});
  for (const { tag, name } of Object.values(categories)) {
    const {
      rowCount
    } = await CategoryRepository.find('id', `tag = '${tag}'`).execute(),
      date = getTimestamp();
    if (!rowCount) {
      dataCategory.push([`'${name}'`, `'${tag}'`, `'${date.created_at}'`, `'${date.updated_at}'`]);
    }
  }
  if (dataCategory.length) {
    await CategoryRepository.save([
      'name',
      'tag',
      'created_at',
      'updated_at'
    ], dataCategory).execute();
  }
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
