import importCsvData from "../modules/import-csv-data.js";
import path from "path";

export default async function ({
  __dirname
}) {
  const data = await importCsvData({
    importPath: path.resolve(__dirname, 'var', 'import')
  });
  Promise.all(data)
    .then(console.log);
}