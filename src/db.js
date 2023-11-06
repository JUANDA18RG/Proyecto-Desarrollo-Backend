
const pgp = require('pg-promise')();

const db = pgp
({
  user: 'postgres',
  host: 'localhost',
  database: 'BookFinder',
  password: '12345',
  port: 5432
})

module.exports = db;
