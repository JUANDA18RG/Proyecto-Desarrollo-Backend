const express = require('express');
const userExtractor = require('./userExtractor');
const routerlogin = express.Router();
const loggin = require('../controllers/login.js');

const router = express.Router();
router.use(express.json());
const register = require('../controllers/register.js');

const updateController = require('../controllers/update.js');
const sendAllBooks = require('../controllers/books.show.js');
const booksdata = require('../controllers/books.data.js');
const sendEmailToResetPassword = require('../controllers/user-password.controller.js');
const changePassword = require('../controllers/change-password.controller.js');

const {searchByAuthor, searchByGenre, searchByTitleDifused, searchByAnioPublicacion } = require('../controllers/search.js');
const validarCod = require('../controllers/codigo-verificacion.js');



router.post('/register', register);

router.put('/updateUser/:username',userExtractor, updateController.updateUserData);

router.post(
  '/send/email',
  sendEmailToResetPassword
  );
router.post(
  '/verificacion',
  validarCod);

  router.post(
  '/reset',
  changePassword
);
 



router.get('/genero/:genero',searchByGenre);
router.get('/autor/:autor',searchByAuthor);
router.get('/aniopublicacion/:aniopublicacion', searchByAnioPublicacion);

// la busqueda por autor ya que contiene varias palabras se debe recibir un post con el titulo
// en el cuerpo de la peticion si se envia como parametro de la url causaria problemas 
// al encontrar espacios entre estos.
router.post('/search/title',searchByTitleDifused);

routerlogin.post('/api/login', loggin);

// mostrar todos los libros para la pagina despues de logearse.
routerlogin.get('/api/Books', sendAllBooks);

router.get('/booksdata', booksdata);

module.exports = {router, routerlogin};
