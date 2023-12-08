const fsql = require('../controllers/task.controllers.js');

const sendAllBooks = async (request, response) => {
    try {
        const books = await fsql.getAllBooksWithValoracion();
        if(books.length === 0){
            return response.status(404).send({
                error: 'No hay libros registrados en la base de datos'
            });
        }
        const bookSummary = books.map(book => {
            // Verificar que todas las propiedades requeridas estén presentes
            const requiredProperties = ['isbn', 'titulo', 'autor', 'portada', 'copiasdisponibles', 'aniopublicacion'];
            const missingProperty = requiredProperties.find(prop => !(prop in book));

            if (missingProperty) {
                throw new Error(`Propiedad faltante (${missingProperty}) en el libro con ISBN ${book.isbn}`);
            }

            // Mapear a un nuevo formato
            return {
                ISBN: book.isbn,
                titulo: book.titulo,
                autor: book.autor,
                portada: book.portada,
                genero: book.genero , // Asegurar que genero esté presente o establecer un valor por defecto
                copiasDisponibles: book.copiasdisponibles,
                copiasReservadas: book.copiasreservadas,
                anioPublicacion: book.aniopublicacion,
                valoracion: parseFloat(book.valoracion || 1).toFixed(1), // Asegurar que valoracion esté presente o establecer un valor por defecto
            };
        });

        response.status(200).send(bookSummary);
    } catch (error) {
        console.error('Error al obtener los libros', error);
        response.status(500).send({
            error: error.message,
        });
    }
};

module.exports = sendAllBooks;
