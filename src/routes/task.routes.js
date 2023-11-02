const express = require('express');

const router = express.Router();
router.use(express.json());

const {getallBooks} = require('../controllers/task.controllers.js');

const authentication = require('../controllers/register.js');
const loginrouter = require('../controllers/login.js');
const updateController = require('../controllers/update.js');

router.get('/api/books', getallBooks);

router.post('/register', authentication.register);

router.put('/updateUser/:username', updateController.updateUserData);

module.exports = router;
