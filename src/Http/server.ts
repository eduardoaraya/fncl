import express, { Express } from 'express';
import debug from 'debug';
import Config from '../config';
import router from './router';
import path from 'path';

const log = debug('app:http:server');
const PORT = Config.server.port;

function middlewares(app: Express, handle: (b: Express) => ({ start(): Express.Application })) {
  app.use(express.static(path.resolve('public')));
  app.use(router());
  return handle(app);
}

export default async function Server() {
  const app = express();
  return middlewares(
    app,
    (app) => ({
      start: () => app.listen(PORT, () => log('> Server on port: %o', PORT))
    })
  );
}