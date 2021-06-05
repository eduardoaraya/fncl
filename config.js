import path from 'path';
import dotenv from 'dotenv';

const dirname = path.resolve(path.dirname(decodeURI(new URL(import.meta.url).pathname)));
dotenv.config({
  path: path.resolve(dirname, '.env.developer')
});

export default {
  basePath: dirname,
  database: {
    postgres: {
      user: process.env.DB_USER,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
    }
  }
}
