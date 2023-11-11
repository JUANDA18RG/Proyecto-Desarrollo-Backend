const pgp = require('pg-promise')();

const db = pgp
({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
  ssl: { rejectUnauthorized: false }
})

module.exports = db;
