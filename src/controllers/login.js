require('dotenv').config();
const bcrypt = require('bcrypt');
const loginrouter = require('express').Router();
const jwt = require('jsonwebtoken');
const fsql = require('../controllers/task.controllers.js');

loginrouter.post('/api/login', async (request, response) => {
    const body = request.body;
    const {correo, password} = body;
    const user = await fsql.getUserByCorreo(correo);
    const passwordCorrect = user === null
        ? false : await bcrypt.compare(password, user[0].passwordhash); // compare the password with the passwordHash de la base de datos

        if (!(user && passwordCorrect)){
            return response.status(401).json({
                error: 'Ocurrió un error en la contraseña o correo'
            });
        }

        const userForToken = {
            username: user[0].username,
            correo: user[0].correo,
        }

        const token = jwt.sign(userForToken, process.env.SECRET); // firmar el token con un objeto y una palabra secreta



        response.status(200).send({
            username: user[0].username,
            correo: user[0].correo,
            isAdmin: user[1],
            token
        });

});

module.exports = loginrouter;