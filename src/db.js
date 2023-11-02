const pgp = require('pg-promise')();

const db = pgp
({
  user: 'postgres',
  host: 'localhost',
  database: 'BookFinder',
  password: '1006463424',
  port: 5432,
})

module.exports = db;


