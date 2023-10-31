const pgp = require('pg-promise')();

const db = pgp
({
  host: 'localhost',
  port: 5432,
  database: 'BookFinder',
  user: 'postgres',
  password: 'Acos306254'
});

module.exports = db;
