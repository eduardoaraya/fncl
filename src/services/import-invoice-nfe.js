import path from "path";
import importCsvData from "../modules/Core/Import/import-csv-data.js";
import ImportRepository from '../modules/Core/Import/repository.js';
import Config from "../../config.js";
import debug from 'debug';

const log = debug('app:import');

log("> Import init");
const excludeFiles = await ImportRepository.find('file').execute();
const importedData = await importCsvData({
  importPath: path.resolve(Config.basePath, 'var', 'import', 'nfe_invoice'),
  excludes: excludeFiles.rows.map(({ file }) => file)
});

for (const content of generate(importedData)) {
  const data = factory((await content.data));
  parseAmountToInt(data);
  log(data);
}

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

function factory(data) {
  const head = data.shift();
  return data
    .map(row => {
      return row.reduce((reducer, current, index) => {
        reducer[head[index]] = current;
        return reducer;
      }, {})
    })
}

function getTimestamp() {
  let date = new Date();
  date = date.getFullYear() + "-" + ((date.getMonth() + 1)) + "-" + ((date.getDate()));
  return {
    created_at: date,
    updated_at: date,
  }
}

function parseAmountToInt(data) {
  data
    .filter(row => row['Valor líquido'] !== undefined)
    .forEach(row => {
      const replaceValue = row['Valor líquido'].replace(/"/g, '').replace(/\./g, '').replace(/,/g, '.');
      let amount = parseFloat(replaceValue);
      amount *= 100;
      row['Valor líquido'] = parseInt(amount);
    })
}