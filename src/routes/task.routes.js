const express = require('express');
const userExtractor = require('./userExtractor');
const routerlogin = express.Router();

const router = express.Router();
router.use(express.json());
const authentication = require('../controllers/register.js');
const loginrouter = require('../controllers/login.js');
const updateController = require('../controllers/update.js');
const sendAllBooks = require('../controllers/books.show.js');


router.post('/register', authentication.register);

router.put('/updateUser/:username',userExtractor, updateController.updateUserData);

routerlogin.post('/api/login', loginrouter.loggin);

// mostrar todos los libros para la pagina despues de logearse.
routerlogin.get('/api/Books', sendAllBooks);

module.exports = {router, routerlogin};
