const fsql = require('../controllers/task.controllers.js');

const booksdata = async (request, response) => {
    try {
        const books = await fsql.getallBooks();
        const bookSummary = books.map((book) => {
            if (!book.isbn || !book.titulo || !book.autor || !book.portada || !book.copiasdisponibles || !book.cantcopias || !book.aniopublicacion) {
                throw new Error('Alguna propiedad no encontrada');
            }
            return {
                id: book.isbn,  // Utiliza el ISBN como el valor del campo "id"
                Titulo: book.titulo,
                description: book.sinopsis,
                image: book.portada,
                Author: book.autor,
                Codigo: book.isbn,
                Disponibles: book.copiasdisponibles,
                Prestados: (book.cantcopias - book.copiasdisponibles),
                Total: book.cantcopias,
                year: book.aniopublicacion,
                categoria: book.genero,
                valoracion: book.valoracion
            };
        });
        response.status(200).send(bookSummary);
    } catch (error) {
        console.error('Error al obtener los libros', error);
        response.status(500).send({
            error: error.message
        });
    }
}

module.exports = booksdata;
