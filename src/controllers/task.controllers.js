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

const getallBooks=  async (req, res) => {
    const books = await db.any('SELECT * FROM books');
    res.json(books);

}

//mostrar un libro



//crear un libro




//actualizar un libro



//llamado a las funciones
module.exports = {
    getallUsername,
    getUserByCorreo,
    getallBooks
}