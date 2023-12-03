const db = require('../db.js');

// Controlador para obtener todos los libros
async function getAllLibros(req, res) {
  try {
    const libros = await db.any('SELECT * FROM libro');
    res.json(libros);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los libros' });
  }
}

// Controlador para buscar un libro por ISBN
async function getLibroByISBN(req, res) {
  const isbn = req.params.isbn;

  try {
    const libro = await db.oneOrNone('SELECT * FROM libro WHERE isbn = $1', isbn);
    if (!libro) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    res.json(libro);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar el libro por ISBN' });
  }
}

// Controlador para actualizar un libro por ISBN
async function updateLibro(req, res) {
  const isbn = req.params.isbn;
  const { titulo, autor, categoria, copiasDisponibles, sinopsis } = req.body;

  try {
    const libroExistente = await db.oneOrNone('SELECT * FROM libro WHERE isbn = $1', isbn);
    if (!libroExistente) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    // Actualizar la información del libro en la base de datos
    const updateQuery = `UPDATE libro
                         SET titulo = COALESCE($2, titulo),
                             autor = COALESCE($3, autor),
                             genero = COALESCE($4, genero),
                             copiasDisponibles = COALESCE($5, copiasDisponibles),
                             sinopsis = COALESCE($6, sinopsis)
                         WHERE isbn = $1`;

    await db.none(updateQuery, [isbn, titulo, autor, categoria, copiasDisponibles, sinopsis]);

    res.json({ status: 'ok', message: 'Libro actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el libro' });
  }
}

module.exports = {
  getAllLibros,
  getLibroByISBN,
  updateLibro,
};


