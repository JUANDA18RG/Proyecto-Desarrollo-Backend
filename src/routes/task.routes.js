const express = require('express');
const userExtractor = require('./userExtractor');
const routerlogin = express.Router();
const loginrouter = require('../controllers/login.js');

const router = express.Router();
router.use(express.json());

const {getallBooks} = require('../controllers/task.controllers.js');

const userExtractor = require('./userExtractor');
const authentication = require('../controllers/register.js');

const updateController = require('../controllers/update.js');
const UserPasswordController = require('../controllers/user-password.controller');

const userPasswordController = new UserPasswordController();


const {searchByAuthor} = require('../controllers/search.js');
const {searchByGenre} = require('../controllers/search.js');

router.get('/api/books', getallBooks);

router.post('/register', authentication.register);

router.put('/updateUser/:username',userExtractor, updateController.updateUserData);

router.post(
  '/send/:email',userExtractor,
  userPasswordController.sendEmailToResetPassword
);

router.post(
  '/reset/:token',userExtractor,
  userPasswordController.resetPassword
);


router.get('/genero/:genero',searchByGenre);
router.get('/autor/:autor',searchByAuthor);

routerlogin.post('/api/login', loginrouter.loggin);
module.exports = {router, routerlogin};
