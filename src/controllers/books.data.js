const fsql = require('../controllers/task.controllers.js');

const booksdata = async (request, response) => {
    try {
        const books = await fsql.getallBooks();
        if (request.params.id) {
            // Si se proporcionó un ID, busca ese libro
            const book = books.find(book => book.isbn === request.params.id);
            if (!book) {
                // Si no se encontró el libro, devuelve un error 404
                return response.status(404).send({
                    error: 'No se encontró un libro con el id ' + request.params.id
                });
            }
            // Devuelve los detalles del libro
            return response.status(200).send(createBookSummary(book));
        }
        // Si no se proporcionó un ID, devuelve un resumen de todos los libros
        const bookSummary = books.map(createBookSummary);
        response.status(200).send(bookSummary);
    } catch (error) {
        console.error('Error al obtener los libros', error);
        response.status(500).send({
            error: error.message
        });
    }
}

function createBookSummary(book) {
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
}

module.exports = booksdata;