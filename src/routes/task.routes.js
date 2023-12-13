const express = require('express');
const userExtractor = require('./userExtractor');
const routerlogin = express.Router();
const loggin = require('../controllers/login.js');
const routerReserva = express.Router();
const routerComentarios = express.Router();
const routerbook = express.Router();

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
const obtenerHistorialReservas = require('../controllers/Historeservas.js');
const realizarComentario = require('../controllers/comentarios.js');
const updateCommentAndRating = require('../controllers/EditComent-valoraciones.js');
const {obtenerHistorialValoraciones,eliminarValoracion,} = require('../controllers/HistoValora.js');
const {deleteUser, deleteUserByUser} = require('../controllers/deleteUser.js');
const {deleteB} = require('../controllers/deleteBooks.js');
const {return_usuarios, return_usuario}= require('../controllers/returnUsuarios.js');
const {completeForm,verifyForm} = require('../controllers/completeFormAdmin.js');
const administrador = require('../controllers/crearFormAdmin.js');
const actualizarEstado = require('../controllers/editarReservaAdmin.js');
const cancelarReserva = require('../controllers/cancelarReserva.js');
const controllers = require('../controllers/updatelibro.js');
const libroController = require('../controllers/FiltroCombinado.js');
const {deleteAdmin, getAdmin, return_administrador} = require('../controllers/deleteAdmin.js');
const updateFiless = require('../controllers/UploadFileOptional.js');
const busquereservaController = require('../controllers/busquereserva');


//busqueda reserva 
router.get('/reservas', busquereservaController.listarReservas);
router.get('/reservas/:id', busquereservaController.buscarReservaPorId);

// Ruta para filtrar libros de forma combinada
router.post('/filtrarLibros', libroController.filtrarLibros);


// Ruta para obtener todos los libros
router.get('/libros', controllers.getAllLibros);

// Ruta para buscar un libro por ISBN
router.get('/libros/:titulo', controllers.getLibroByTitulo);

// Ruta para actualizar un libro por ISBN------------------------------------
router.put('/updateLibro/:isbn',userExtractor, updateFiless.optionalUpload, updateFiless.uploadFile, controllers.updateLibro);

// para crear libros
const controlador = require('../controllers/uploadFiles.js');
const createBook = require('../controllers/createBook.js');

// para la verificación
const verificacionUser = require('../controllers/verifyDeleteUser.js');

router.post('/register', register);
router.put('/updateUser/:username',userExtractor, updateController.updateUserData);
router.post('/send/email', sendEmailToResetPassword);
router.post('/verificacion', validarCod);
router.post('/reset', changePassword);
router.get('/historeservas/:usuario', obtenerHistorialReservas);
router.get('/histovaloraciones/:usuario', obtenerHistorialValoraciones);
router.delete('/valoraciones/:id', eliminarValoracion);
router.post('/createUser', userExtractor, administrador);
router.put('/cambiarEstado/:id', userExtractor, actualizarEstado);


// la busqueda por autor ya que contiene varias palabras se debe recibir un post con el titulo
// en el cuerpo de la peticion si se envia como parametro de la url causaria problemas 
// al encontrar espacios entre estos.
router.post('/search/title',searchByTitleDifused);
router.get('/genero/:genero',searchByGenre);
router.get('/autor/:autor',searchByAuthor);
router.get('/aniopublicacion/:aniopublicacion', searchByAnioPublicacion);
router.post('/completarFormulario', userExtractor,completeForm);
router.get('/completarFormulario', verifyForm);
routerlogin.post('/api/login', loggin);

// mostrar todos los libros para la pagina despues de logearse.
routerlogin.get('/api/Books', sendAllBooks);

router.get('/booksdata/:id', booksdata);

routerReserva.post('/booking', userExtractor, booking);


routerReserva.get('/:id', obtenerInfoReserva);

// al  realizar estas peticion debes enviar tambien el token de autorizacion
routerReserva.put('/EditarReserva',userExtractor, actualizarFechaDevolucion);
routerReserva.put('/cancelarReserva/:id', userExtractor, cancelarReserva);


// actualizar comentario y valoracion
routerComentarios.put('/actualizar', userExtractor, updateCommentAndRating);

routerComentarios.post('/comentar', userExtractor, realizarComentario); 


const sendAllComments = require('../controllers/comments.show.js');
routerComentarios.get('/enviarComentarios', sendAllComments);

router.delete('/deleteUser/:username', userExtractor, deleteUser);
router.delete('/BorrarLibros', userExtractor, deleteB);
router.delete('/eliminarAdmin/:username', userExtractor, deleteAdmin);

router.get('/returnUsuarios', return_usuarios);
router.get('/returnUsuario/:username', return_usuario);

router.delete('/deleteUserByUser', userExtractor, deleteUserByUser); // borrar usuario por el mismo usuario

routerbook.post('/createBook',userExtractor, controlador.upload, controlador.uploadFile, createBook);

// ruta para verificar si el usuario no ha sido eliminado por administrador
router.get('/verificarUsuario', userExtractor, verificacionUser);
router.get('/administradores', getAdmin);
router.get('/returnAdministrador/:username', return_administrador);



module.exports = {router, routerlogin, routerReserva, routerComentarios, routerbook};