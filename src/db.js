
const pgp = require('pg-promise')();

const db = pgp
({
  user: 'postgres',
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: 5432
})

module.exports = db;
