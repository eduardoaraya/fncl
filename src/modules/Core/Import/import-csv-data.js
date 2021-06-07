import fsPromise from 'fs/promises';
import path from 'path';

export default ({ importPath, excludes }) =>
  readyFolder(importPath, excludes)
    .then(prepareQueueCsvFiles)
    .then(getData);

async function readyFolder(path, excludes) {
  if (!path) return console.error("Error: invalid path");
  const files = (await fsPromise.readdir(path))
    .filter(item => {
      return !excludes.includes(item);
    });
  return {
    basePath: path,
    files
  };
}

async function prepareQueueCsvFiles({ basePath, files }) {
  return files.map(async file => {
    const filePath = path.resolve(basePath, file);
    return {
      getData: async () => (await fsPromise.readFile(filePath)).toString().split('\n').map(item => item.split(',')),
      fileName: file
    }
  });
}

async function getData(data) {
  return await factory((await Promise.all(data)));
}

async function factory(data) {
  return await data.reduce(
    (reducer, buffer) => {
      reducer[buffer.fileName] = buffer.getData();
      return reducer;
    }, {});
}

