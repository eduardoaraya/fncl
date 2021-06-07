import express from 'express';
import debug from 'debug';
import Config from '../../config.js';
import router from './router.js';

const log = debug('app:http:server');
const PORT = Config.server.port;

export default async function Server() {
  const app = express();
  app.use(router());
  return {
    start: () => app.listen(PORT, () => log('> Server on port: %o', PORT))
  }
}