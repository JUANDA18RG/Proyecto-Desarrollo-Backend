require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fsql = require('./task.controllers.js');
const db = require('../db.js');
db.connect();

async function administrador(req, res) {
  const { username, correo, password } = req.body;

  // Valida que todos los campos estén completos
  if (!username || !correo || !password) {
    return res.status(400).send({ status: 'Error', message: 'Los campos tienen que estar completos para completar su solicitud' });
  }

  // Valida que el username no exista en la base de datos
  const userExist = await fsql.getallUsername(username);
  const correoExist = await fsql.getUserByCorreo(correo);

  if (!(correoExist === null) && userExist) {
    return res.status(400).send({ status: 'Correo y usuario existente', message: 'Ya existe el correo y el nombre de usuario' });
  }

  if (userExist) {
    return res.status(400).send({ status: 'Usuario existente', message: 'Ya existe el username' });
  }

  // Valida que el correo no exista en la base de datos
  if (!(correoExist === null)) {
    return res.status(400).send({ status: 'Correo existente', message: 'Ya existe el correo' });
  }

  // Encriptacion de la contraseña con bcrypt
  const salt = await bcrypt.genSalt(8); // 10 saltos por defecto
  const passwordHash = await bcrypt.hash(password, salt);

  // insertar usuario en la base de datos
  try {
    await db.none('INSERT INTO persona(username, correo, passwordhash) VALUES($1, $2, $3)', [username, correo, passwordHash]);
    await db.none('INSERT INTO usuario(username, isAdmin) VALUES($1, $2)', [username, true]);

    // Generar el token
    const userForToken = {
      username: username,
      correo: correo,
      isAdmin: true
    };

    const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '1d' });

    return res.status(201).send({
      status: 'ok',
      message: `El usuario con username ${username} fue creado exitosamente`,
      isAdmin: true,
      token: token
    });
  } catch (error) {
    console.error('Error al intentar crear usuario', error);
    return res.status(400).send({ status: 'Usuario no creado', message: 'Fallo al intentar crear usuario', error: error.message });
  }
}

module.exports = administrador;
