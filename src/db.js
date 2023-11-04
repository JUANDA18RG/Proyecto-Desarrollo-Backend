 
const pgp = require('pg-promise')();

const db = pgp
({
  user: 'niko',
  host: 'localhost',
  database: 'desarrollo',
  password: '123456',
  port: 5432,
})

module.exports = db;
