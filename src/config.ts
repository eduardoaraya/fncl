import path from 'path';
import * as dotenv from 'dotenv';
import process from 'process';

type Config = {
  basePath: String | undefined,
  server: {
    port: String | undefined
  },
  database: {
    postgres: {
      user: String | undefined,
      database: String | undefined,
      password: string | undefined
    }
  }
}

dotenv.config({
  path: path.resolve('.env.developer')
});

export default <Config>{
  basePath: './',
  server: {
    port: process.env.EXPRESS_PORT
  },
  database: {
    postgres: {
      user: process.env.DB_USER,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
    }
  }
}