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
  )`,
  `CREATE TABLE IF NOT EXISTS import (
    id SERIAL PRIMARY KEY,
    file VARCHAR (45),
    created_at DATE NOT NULL,
    updated_at DATE NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS profit (
    id SERIAL PRIMARY KEY,
    value INT NOT NULL,
    payment_by VARCHAR(244) NOT NULL,
    date DATE NOT NULL,
    created_at DATE NOT NULL,
    updated_at DATE NOT NULL
  )`
];

const migrate = () => {
  return createTableQueryList
    .map(query => database.getConnection().query(query));
}

export default migrate();