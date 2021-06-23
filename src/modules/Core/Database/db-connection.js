import Pg from 'pg';
import config from '../../../config.ts';
import debug from 'debug';

const log = debug('app:database');

const client = new Pg.Client({
  user: config.database.postgres.user,
  database: config.database.postgres.database,
  password: config.database.postgres.password,
})
client.on("notice", log);
client.on("error", log);
client.connect();

export default {
  getConnection: () => client,
}