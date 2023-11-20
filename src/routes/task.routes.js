const express = require('express');
const userExtractor = require('./userExtractor');
const routerlogin = express.Router();
const loggin = require('../controllers/login.js');
const routerReserva = express.Router();
const routerComentarios = express.Router();

const router = express.Router();
router.use(express.json());

const register = require('../controllers/register.js');
const updateController = require('../controllers/update.js');
const sendAllBooks = require('../controllers/books.show.js');
const booksdata = require('../controllers/books.data.js');
const sendEmailToResetPassword = require('../controllers/user-password.controller.js');
const changePassword = require('../controllers/change-password.controller.js');
const validarCod = require('../controllers/codigo-verificacion.js');
const {searchByAuthor, searchByGenre, searchByTitleDifused, searchByAnioPublicacion, searchCombined } = require('../controllers/search.js');
const obtenerInfoReserva = require('../controllers/infoReserva.js');
const actualizarFechaDevolucion = require('../controllers/EditReserva.js');
const booking = require('../controllers/bookings.js');
//const { searchCombined } = require('../controllers/FiltroCombinado.js');
const obtenerHistorialReservas = require('../controllers/Historeservas.js');
const realizarComentario = require('../controllers/comentarios.js');
const {obtenerHistorialValoraciones,eliminarValoracion,} = require('../controllers/HistoValora.js');



router.post('/register', register);
router.put('/updateUser/:username',userExtractor, updateController.updateUserData);
router.post('/send/email', sendEmailToResetPassword);
router.post('/verificacion', validarCod);
router.post('/reset', changePassword);
router.get('/historeservas/:usuario', obtenerHistorialReservas);
router.get('/histovaloraciones/:usuario', obtenerHistorialValoraciones);
router.delete('/valoraciones/:id', eliminarValoracion);


// la busqueda por autor ya que contiene varias palabras se debe recibir un post con el titulo
// en el cuerpo de la peticion si se envia como parametro de la url causaria problemas 
// al encontrar espacios entre estos.
router.post('/search/title',searchByTitleDifused);
router.get('/genero/:genero',searchByGenre);
router.get('/autor/:autor',searchByAuthor);
router.get('/aniopublicacion/:aniopublicacion', searchByAnioPublicacion);
router.post('/search/combined', searchCombined);


routerlogin.post('/api/login', loggin);

// mostrar todos los libros para la pagina despues de logearse.
routerlogin.get('/api/Books', sendAllBooks);

router.get('/booksdata/:id', booksdata);

routerReserva.post('/booking', userExtractor, booking);


routerReserva.get('/:id', obtenerInfoReserva);

// al  realizar esta peticion debes enviar tambien el token de autorizacion
routerReserva.put('/EditarReserva',userExtractor, actualizarFechaDevolucion);


routerComentarios.post('/comentar', userExtractor, realizarComentario); 

const sendAllComments = require('../controllers/comments.show.js');
routerComentarios.get('/enviarComentarios', sendAllComments);

module.exports = {router, routerlogin, routerReserva, routerComentarios};