const bcrypt = require('bcryptjs'); // este modulo utiliza hash incorporando saltos (iteraciones) para encriptar la clave
const fsql = require('./task.controllers.js');
const db = require('../db.js');
db.connect();

async function register (req, res)
{
  let username = req.body.username;
  let nombres = req.body.nombres;
  let apellidos = req.body.apellidos;
  let correo = req.body.correo;
  let password = req.body.password;

    // Valida que todos los campos estén completos
  if(!username || !nombres || !apellidos || !correo || !password)
  {
      return res.status(400).send({status: 'Error', message: 'Los campos tienen que estar completos para completar su solicitud'});
  }

    //Valida que el username no exista en la base de datos
  const userExist = await fsql.getallUsername(username);
  if (userExist)
  {
    return res.status(400).send({status: 'Usuario existente', message: 'Ya existe el username'});
  }

  //Valida que el correo no exista en la base de datos
  const correoExist = await fsql.getUserByCorreo(correo);
  if(!(correoExist === null))
  {
    return res.status(400).send({status: 'Correo existente', message: 'Ya existe el correo'});
  }

  // Valida que el nombre de usuario no empiece por numero o simbolo
  const expresionRegular = /^[0-9!@#$-_%^'&*]/; // Esta expresión regular verifica si el primer carácter es un número o alguno de los símbolos
  if (expresionRegular.test(username)) 
  {
    return res.status(400).send({status: 'username no valido', message: 'El username empieza por un numero o simbolo'});
  }
  
  // Valida que el nombre no contenga numeros ni simbolos
  const expresionAlfabetica = /^[A-Za-z]+$/;
  if (!(expresionAlfabetica.test(nombres)) )
  {
    return res.status(400).send({status: 'nombre no valido', message: 'El nombre contiene numeros o simbolos'});
  }

  // Valida que el nombre no contenga numeros ni simbolos
  if (!(expresionAlfabetica.test(apellidos)))
  {
    return res.status(400).send({status: 'apellido no valido', message: 'Los apellidos contienen numeros o simbolos'});
  }

  // Valida que la contraseña tengo por lo menos una letra mayúscula, una letra minúscula y un carácter especial
  const expresionContraseña = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[@#$%*-^&+=!]).+$/;
  if (!(expresionContraseña.test(password)))
  {
    return res.status(400).send({status: 'contraseña no valida', message: 'La contraseña debe contener por lo menos una mayuscula, una minuscula y un caracter especial'});
  } 
  
  // Encriptacion de la contraseña con bcrypt
  const salt = await bcrypt.genSalt(8); // 10 saltos por default
  const passwordHash = await bcrypt.hash(password, salt);

  // insertar usuario en la base de datos
  db.none('INSERT INTO persona VALUES($1, $2, $3, $4, $5)' , [username,nombres, apellidos, correo, passwordHash])
  .then(() => 
  {
    db.none('INSERT INTO usuario VALUES($1)', [username]);
    return res.status(201).send({status: 'ok', message: `El usuario con username ${username} fue creado exitosamente`
  })})
  .catch(error => {
    return res.status(400).send({status: 'Usuario no creado', message: 'Fallo al intentar crear usuario'});
  });
}


module.exports.register = register;
