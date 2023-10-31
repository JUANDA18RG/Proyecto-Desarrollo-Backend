const express = require('express');

const router = express.Router();

const { getallBooks} = require('../controllers/task.controllers.js');
// Conectar a la base de datos al inicializar el router

const authentication = require('../controllers/register.js');

router.get('/api/books', getallBooks);


router.post('/register', authentication.register);


module.exports = router;
