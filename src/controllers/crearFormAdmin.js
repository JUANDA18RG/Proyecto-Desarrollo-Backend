const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fsql = require('../controllers/task.controllers.js');
const db = require('../db.js');


async function administrador(req, res) {
  const { username, correo, password } = req.body;

  try {
    const jefe = req.username;
    // Validaciones
    if (!username || !correo || !password) {
      return res.status(400).send({ status: 'Error', message: 'Los campos deben estar completos para completar la solicitud.' });
    }

    const userExist = await fsql.getallUsername(username);
    const correoExist = await fsql.getUserByCorreo(correo);

    if (correoExist !== null && userExist) {
      return res.status(400).send({ status: 'Correo y usuario existentes', message: 'Ya existe el correo y el nombre de usuario.' });
    }

    if (userExist) {
      return res.status(400).send({ status: 'Usuario existente', message: 'Ya existe el nombre de usuario.' });
    }

    if (correoExist !== null) {
      return res.status(400).send({ status: 'Correo existente', message: 'Ya existe el correo.' });
    }

    // Ajustar la longitud del username si es necesario
    const truncatedUsername = username.substring(0, 15);

    // Encriptación de la contraseña con bcrypt
    const salt = await bcrypt.genSalt(10); // Aumentado a 10 saltos
    const passwordHash = await bcrypt.hash(password, salt);

    // Inserciones en la base de datos
    await db.tx(async (t) => {
      await t.none('INSERT INTO persona(username, correo, passwordhash) VALUES($1, $2, $3)', [truncatedUsername, correo, passwordHash]);
      await t.none('INSERT INTO administrador(username, jefe) VALUES($1, $2)', [truncatedUsername, jefe]);
    });

    // Generar el token
    const userForToken = { username: truncatedUsername, correo, isAdmin: true };
    const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '1d' });

    return res.status(201).send({
      status: 'OK',
      message: `El usuario con nombre de usuario ${truncatedUsername} fue creado exitosamente.`,
      isAdmin: true,
      token: token,
    });
  } catch (error) {
    console.error('Error al intentar crear usuario', error);
    return res.status(500).send({ status: 'Error interno del servidor', message: 'Fallo al intentar crear usuario.', error: error.message });
  }
}

module.exports = administrador;
