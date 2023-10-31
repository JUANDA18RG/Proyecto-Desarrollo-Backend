const express = require('express');

const router = express.Router();
router.use(express.json());

const { getallBooks} = require('../controllers/task.controllers.js');

const authentication = require('../controllers/register.js');
const loginrouter = require('../controllers/login.js');

router.get('/api/books', getallBooks);

router.post('/api/login', loginrouter);

router.post('/register', authentication.register);

module.exports = router;
