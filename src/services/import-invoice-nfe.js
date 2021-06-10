import path from "path";
import importCsvData from "../modules/Core/Import/import-csv-data.js";
import ImportRepository from '../modules/Core/Import/repository.js';
import ProfitRepository from '../modules/Profit/repository.js';
import Config from "../config.ts/index.js.js";
import debug from 'debug';

const log = debug('app:import:nfe');

log("> Import init");
const excludeFiles = await ImportRepository.find('file').execute();
console.log(excludeFiles);
const importedData = await importCsvData({
  importPath: path.resolve(Config.basePath, 'var', 'import', 'nfe_invoice'),
  excludes: excludeFiles.rows.map(({ file }) => file)
});

for (const content of generate(importedData)) {
  const data = factory((await content.data));
  parseAmountToInt(data);
  const {
    created_at,
    updated_at
  } = getTimestamp();
  const query = ProfitRepository
    .save([
      'date',
      'payment_by',
      'value',
      'created_at',
      'updated_at'
    ], data.map((value) => [...Object.values(value), created_at, updated_at]));
  await query.execute();
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
  const filterHead = [
    'Data de emissão',
    'Valor líquido',
    'Nome do tomador'
  ];
  return data
    .map(row => {
      return row.reduce((reducer, current, index) => {
        if (filterHead.includes(head[index])) {
          if (head[index] === 'Data de emissão') {
            const [d, m, y] = current.split('/');
            current = `${y}-${m}-${d}`;
          }
          reducer[head[index]] = current;
        }
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