const fsql = require('../controllers/task.controllers.js');
// enviar todos los libros de la base de datos al frontend

const sendAllBooks = async (request, response) => {
    try{
    const books = await fsql.getallBooks();
    const bookSummary = books.map(book => {
        if (!book.isbn || !book.titulo || !book.autor || !book.portada || !book.copiasdisponibles || !book.cantcopias || !book.aniopublicacion) {
            throw new Error('Alguna propiedad no encontrada');
        }
        return {
        
        ISBN: book.isbn,
        titulo: book.titulo,
        autor: book.autor,
        portada: book.portada,
        copiasDisponibles: book.copiasdisponibles,
        copiasReservadas: (book.cantcopias - book.copiasdisponibles),
        anioPublicacion: book.aniopublicacion

    }});
    response.status(200).send(bookSummary);

    }catch(error){
    console.error('Error al obtener los libros', error);
    response.status(500).send({
        error: error.message
    });
}
}

module.exports = sendAllBooks;