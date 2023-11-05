const express = require('express');

const router = express.Router();
router.use(express.json());

const {getallBooks} = require('../controllers/task.controllers.js');

const authentication = require('../controllers/register.js');

const updateController = require('../controllers/update.js');


const {searchByAuthor} = require('../controllers/search.js');
const {searchByGenre} = require('../controllers/search.js');

router.get('/api/books', getallBooks);

router.post('/register', authentication.register);

router.put('/updateUser/:username', updateController.updateUserData);

router.get('/genero/:genero',searchByGenre);
router.get('/autor/:autor',searchByAuthor);


module.exports = router;
