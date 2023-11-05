 
const pgp = require('pg-promise')();

const db = pgp
({
  user: 'postgres',
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'r2301311',
  port: 5432,
})

module.exports = db;
