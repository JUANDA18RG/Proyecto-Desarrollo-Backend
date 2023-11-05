const db = require('../db.js');

//mostrar todos los libros

// mostrar username
const getallUsername = async (username) => 
{
    try
    {
        const user = await db.oneOrNone('SELECT * FROM usuario WHERE username = $1', [username]);
        if(user)
        {
           return true;
        }
        return false;
        
    }
    catch(error)
    {
        console.error('Hay mas de dos usuarios con el mismo username', error);
    }
}


const getUserByCorreo = async (correo) => 
{
    try
    {
        
        const user = await db.oneOrNone('SELECT * FROM persona WHERE correo = $1', [correo]);
        if(user)
        {
            const admin = await db.oneOrNone('SELECT * FROM administrador WHERE username = $1', [user.username]);
            if(admin){
                return [user, true]; // si es true significa que la persona es admin
            }
            return [user, false]; // si es false significa que la persona es usuario
        }
        return null;
    }
    catch(error)
    {
        console.error('Hay mas de dos usuarios con el mismo correo', error);
    }

}

async function getallBooks(){
    try{
        const books = await db.any('SELECT * FROM libro');
        return books;
    }catch(error){
        console.error('Error al obtener los libros', error);
        throw error;
    }
}

//me devuelve el usuario con respectivo username
const getUserByUsername = async (username) => 
{
    try
    {
        const user = await db.oneOrNone('SELECT * FROM usuario WHERE username = $1', [username]);
        return user;
    }
    catch(error)
    {
        console.error('Hay mas de dos usuarios con el mismo username', error);
    }
}
// const username oneOrNone('select username from administrador where codVerificacion = $1', ['OCSLDF']);
// if(username){ cambia la contraseña update



const setIntoCodigo = async (tipoPersona, user, codigo) => 
{
    try
    {
        if(tipoPersona === 'administrador'){
        await db.none(`UPDATE administrador SET codVerificacion = $1  WHERE username = $2`, [codigo, user.username]);
        return true;
        }else if(tipoPersona === 'usuario'){
        await db.none(`UPDATE usuario SET codVerificacion = $1  WHERE username = $2`, [codigo, user.username]);
        return true;
        }else{return false;}
    }
    catch(error)
    {
        console.error('Hay un error al guardar el codigo en la función setIntocodigo', error);
        return error;
    }
}




//crear un libro




//actualizar un libro



//llamado a las funciones
module.exports = {
    getallUsername,
    getUserByCorreo,
    getallBooks,
    getUserByUsername,
    setIntoCodigo
}