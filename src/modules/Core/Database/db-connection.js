import Pg from 'pg';
import config from '../../../config.ts';


const client = new Pg.Client({
  user: config.database.postgres.user,
  database: config.database.postgres.database,
  password: config.database.postgres.password,
})
client.on("notice", console.error);
client.connect();

export default {
  getConnection: () => client,
}