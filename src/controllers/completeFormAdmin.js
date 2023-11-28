const db = require('../db.js');
const bcrypt = require('bcrypt');
const {getUserByCorreo} = require('./task.controllers.js');

async function completeForm (req, res)
{
    const username = req.username;
    const correo = req.correo;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const password = req.body.password;
    
    const isAdmin =  await getUserByCorreo(correo);

    if(isAdmin === null)
    {
        return res.status(400).send({message: 'El usuario no existe'});
    }

    if( isAdmin[1] == false)
    {
        return res.status(400).send({message: 'El usuario no es un administrador'});
    }

    const expresionContraseña = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[@#$%*-^&_+=!]).{8,}$/;

    if (!expresionContraseña.test(password)) 
    {
        return res.status(400).send({ error: 'La contraseña debe tener 8 caracteres,contener por lo menos una mayuscula, una minuscula y un caracter especial' });
    }
    const salt = await bcrypt.genSalt(8);
    const passwordHash = await bcrypt.hash(password, salt);


    db.one('SELECT * FROM persona WHERE username = $1',[username])
    .then(resultado => 
        {
            if(resultado.nombres == null & resultado.apellidos == null)
            {
                db.none('UPDATE persona SET nombres = $1, apellidos = $2, passwordhash = $3 WHERE username = $4', [nombre, apellido, passwordHash, username])
                .then(resultado =>
                    {
                        return res.status(200).send({message: 'Los datos se han ingresado correctamente'});
                    })
                .catch(error => 
                    {return error});
            }
            else
            {
                return res.status(400).send({message: 'El usuario ya ha ingresado los datos'});
            }
        })
    .catch(error =>{return error;});
    
}


async function verifyForm (req,res)
{
    try
    {
        const correo = req.query.correo;
        const isAdmin =  await getUserByCorreo(correo);

        if(isAdmin === null)
        {
            return res.status(400).send({message: 'El usuario no existe'});
        }

        if( isAdmin[1] == false)
        {
            return res.status(400).send({message: 'El usuario no es un administrador'});
        }

        db.one('SELECT * FROM persona WHERE correo = $1',[correo])
        .then(resultado => 
            {
                if(resultado.nombres == null & resultado.apellidos == null)
                {
                    return res.status(200).send({form: true});
                }
                else
                {
                    return res.status(200).send({form: false});
                }
            })
    }
    catch(error)
    {
        return res.status(500).json({message: 'Error al verificar formulario'});
    }
    
}

module.exports = {completeForm, verifyForm};
