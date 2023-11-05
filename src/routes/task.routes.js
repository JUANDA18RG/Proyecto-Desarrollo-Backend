const express = require('express');

const router = express.Router();
router.use(express.json());

const {getallBooks} = require('../controllers/task.controllers.js');

const userExtractor = require('./userExtractor');
const authentication = require('../controllers/register.js');
const loginrouter = require('../controllers/login.js');
const updateController = require('../controllers/update.js');
const UserPasswordController = require('../controllers/user-password.controller');

const userPasswordController = new UserPasswordController();

router.get('/api/books', getallBooks);

router.post('/register', authentication.register);

router.put('/updateUser/:username', updateController.updateUserData);

router.post(
  '/send/:email',userExtractor,
  userPasswordController.sendEmailToResetPassword
);

router.post(
  '/reset/:token',userExtractor,
  userPasswordController.resetPassword
);


module.exports = router;
