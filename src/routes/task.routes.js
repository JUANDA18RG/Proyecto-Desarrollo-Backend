const express = require('express');

const router = express.Router();

const { getallBooks} = require('../controllers/task.controllers.js');
// Conectar a la base de datos al inicializar el router

router.get('/books', getallBooks);



module.exports = router;
