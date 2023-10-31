const db = require('../db.js');

//mostrar todos los libros
const getallBooks=  async (req, res) => {
    const books = await db.any('SELECT * FROM books');
    res.json(books);

}

//mostrar un libro



//crear un libro




//actualizar un libro


//buscar un usuario por correo unico

const getUserByCorreo = async (correo) => {
    const user = await db.oneOrNone('SELECT * FROM persona WHERE correo = $1', [correo]);
    if(user){
        const admin = await db.oneOrNone('SELECT * FROM administrador WHERE username = $1', [user.username]);
        if(admin){
            return [user, true]; // si es true significa que la persona es admin
        }
        return [user, false]; // si es false significa que la persona es usuario
    }
    return null;
}

//llamado a las funciones
module.exports = {
    getallBooks,
    getUserByCorreo
}