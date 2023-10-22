const Database = require('../db.js');
const db = new Database();
db.connect();

//mostrar todos los libros
const getallBooks=  async (req, res) => {
    const books = await db.getBooks();
    res.json(books);
}

//mostrar un libro



//crear un libro




//actualizar un libro






//llamado a las funciones
module.exports = {
    getallBooks
}