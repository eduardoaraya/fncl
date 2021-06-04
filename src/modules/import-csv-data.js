import fsPromise from 'fs/promises';
import path from 'path';

export default ({ importPath }) =>
  readyFolder(importPath)
    .then(prepareQueueCsvFiles)
    .then(getData);

async function readyFolder(path) {
  if (!path) return console.error("Error: invalid path");
  return {
    basePath: path,
    files: await fsPromise.readdir(path)
  };
}

async function prepareQueueCsvFiles({ basePath, files }) {
  return files.map(async file => {
    const filePath = path.resolve(basePath, file);
    return {
      getData: async () => (await fsPromise.readFile(filePath)).toString()
    }
  });
}

async function getData(data) {
  return Promise.all(data)
    .then(data => data.map(async buffer => {
      const importData = await buffer.getData();
      return importData.split('\n')
        .map(row => row.split(','));
    }));
}

