 
const bcrypt = require('bcrypt');
const db = require('../db.js');
const jwt = require('jsonwebtoken');

async function updateUserData(req, res) {
  const { nombres, apellidos, password } = req.body;
  const userId = req.params.username; // Obtén el nombre de usuario desde los parámetros de la ruta

  let updateFields = {};

  if (nombres) {
    const expresionAlfabetica = /^[A-Za-z ]+/;
    if (!(expresionAlfabetica.test(nombres))) {
      return res.status(400).send({ status: 'nombre no válido', message: 'El nombre contiene números o símbolos' });
    }
    updateFields.nombres = nombres;
  }
  if (apellidos) {
    const expresionAlfabetica = /^[A-Za-z ]+/;
    if (!(expresionAlfabetica.test(apellidos))) {
      return res.status(400).send({ status: 'apellido no válido', message: 'Los apellidos contienen números o símbolos' });
    }
    updateFields.apellidos = apellidos;
  }
  if (password) {
    const expresionContraseña = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[@#$%*-^&+=!]).+$/;
    if (!expresionContraseña.test(password)) {
      return res.status(400).send({ status: 'contraseña no válida', message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un carácter especial' });
    }
    const salt = await bcrypt.genSalt(8);
    const passwordHash = await bcrypt.hash(password, salt);
    updateFields.passwordhash = passwordHash;
  }

  if (Object.keys(updateFields).length === 0) {
    return res.status(400).send({ status: 'Error', message: 'Ningún campo válido proporcionado para actualizar' });
  }

  // Asegúrate de que la actualización solo se aplique al usuario autenticado
  const updateQuery = {
    text: 'UPDATE persona SET ' + Object.keys(updateFields).map((field, index) => `${field} = $${index + 1}`).join(', ') + ' WHERE username = $' + (Object.keys(updateFields).length + 1) + ' AND username = $' + (Object.keys(updateFields).length + 2),
    values: [...Object.values(updateFields), userId, userId]
  };

  db.none(updateQuery)
    .then(() => {
      return res.status(200).send({ status: 'ok', message: 'Datos actualizados exitosamente' });
    })
    .catch(error => {
      return res.status(400).send({ status: 'Error', message: 'Fallo al intentar actualizar los datos' });
    });
}

module.exports = {
  updateUserData
};