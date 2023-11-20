/*const fs = require('fs');
const path = require('path');
const pgp = require('pg-promise')();
require('dotenv').config();*/
/*
const db = pgp({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync(path.join(__dirname, '..', 'certs', 'DigiCertGlobalRootCA.crt.pem')).toString()
  },
  port: 5432,
});*/


/*const db = pgp({
  user: 'postgres',
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: 5432,
})



module.exports = db;
*/

 
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
