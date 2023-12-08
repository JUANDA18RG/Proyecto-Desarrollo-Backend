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
            const val = await fsql.getpromedioValoracion(request.params.id);
            const valoracion = val.valoracion;
            // Devuelve los detalles del libro
            return response.status(200).send(createBookSummary(book,valoracion));
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

function createBookSummary(book,valoracion) {
    // Lista de propiedades requeridas
    const requiredProperties = ['isbn', 'titulo', 'autor', 'portada', 'copiasdisponibles', 'cantcopias', 'aniopublicacion'];

    // Verificar la presencia de las propiedades requeridas y asignar valores predeterminados o "desconocidos" si es necesario
    const bookSummary = {
        id: book.isbn || 'Desconocido',
        Titulo: book.titulo || 'Desconocido',
        description: book.sinopsis || 'Sin descripción disponible',
        image: book.portada || 'Imagen no disponible',
        Author: book.autor || 'Desconocido',
        Codigo: book.isbn || 'Desconocido',
        Disponibles: book.copiasdisponibles || 0,
        Prestados: (book.cantcopias - (book.copiasdisponibles || 0)),
        Total: book.cantcopias || 0,
        year: book.aniopublicacion || 'Año de publicación desconocido',
        categoria: book.genero || 'Categoría no especificada',
        valoracion: parseFloat(valoracion || 1).toFixed(1),
    };

    return bookSummary;
}

module.exports = booksdata;