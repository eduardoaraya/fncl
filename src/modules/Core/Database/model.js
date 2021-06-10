import database from './db-connection.js';

export default function (table) {
  const connection = database.getConnection();

  function insert(fields, values) {

    values = typeof values === 'string'
      ? `(${values})`
      : values.map(item => `(${item.map(item => `'${item}'`).join(', ')})`).join(',');

    fields = typeof fields === 'string'
      ? fields
      : fields.join(', ');

    const query = `INSERT INTO ${table} (${fields}) 
      VALUES ${values};`;
    return {
      toString: () => query,
      execute: () => connection.query(query)
    };
  }

  function find(fields, condition = null) {

    fields = typeof fields === 'string'
      ? fields
      : fields.join(',');

    const query = !condition
      ? `SELECT ${fields} FROM ${table}`
      : `SELECT (${fields}) FROM ${table} WHERE ${condition}`;

    return {
      toString: () => query,
      execute: () => connection.query(query)
    };
  }

  return {
    table,
    insert,
    find,
    queryRow: (query) =>
    ({
      toString: () => query,
      execute: () => connection.query(query)
    })
  }
}