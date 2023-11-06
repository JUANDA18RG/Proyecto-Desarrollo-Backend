 
const pgp = require('pg-promise')();

const db = pgp
({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: 5432
})

module.exports = db;
