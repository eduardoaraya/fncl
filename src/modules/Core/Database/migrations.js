import database from './db-connection.js';

const createTableQueryList = [
  `CREATE TABLE IF NOT EXISTS category (
    id SERIAL PRIMARY KEY,
    name VARCHAR (45) NOT NULL,
    tag VARCHAR (45) NOT NULL UNIQUE,
    created_at DATE NOT NULL,
    updated_at DATE NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS expense (
    id SERIAL PRIMARY KEY,
    category_id INT NOT NULL,
    value INT NOT NULL,
    title VARCHAR (244),
    date DATE NOT NULL,
    created_at DATE NOT NULL,
    updated_at DATE NOT NULL
  )`
];

export default () => {
  return createTableQueryList
    .map(query => database.getConnection().query(query));
}