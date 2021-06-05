import Pg from 'pg';
import config from '../../../../config.js';

const client = new Pg.Client({
  user: config.database.postgres.user,
  database: config.database.postgres.database,
  password: config.database.postgres.password,
})

// client.on("notice", console.log);
client.on('error', console.error);
// client.on("end", console.log);

client.connect();

export default {
  getConnection: () => client,
}