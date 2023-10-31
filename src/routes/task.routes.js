const express = require('express');

const router = express.Router();
router.use(express.json());

const { getallBooks} = require('../controllers/task.controllers.js');

const authentication = require('../controllers/register.js');


router.post('/register', authentication.register);

module.exports = router;
