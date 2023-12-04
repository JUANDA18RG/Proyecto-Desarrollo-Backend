const db = require('../db.js');
const fs = require('fs').promises;
const path = require('path');

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
  const { titulo, autor, genero, copiasdisponibles, sinopsis, añopublicacion } = req.body;

  try {
    const libroExistente = await db.oneOrNone('SELECT * FROM libro WHERE isbn = $1', isbn);
    if (!libroExistente) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    // Ruta donde se almacenan las imágenes de portada (ajústala según tu estructura)
    const uploadPath = path.join(__dirname, '..', 'uploads');

    // Verifica si se proporciona una nueva portada en la solicitud
    if (req.file) {
      // Elimina la portada anterior si existe
      if (libroExistente.portada) {
        const portadaPath = path.join(uploadPath, libroExistente.portada);
        await fs.unlink(portadaPath);
      }

      // Guarda la nueva portada en la carpeta de subidas
      const nuevaPortadaPath = path.join(uploadPath, req.file.filename);
      await fs.rename(req.file.path, nuevaPortadaPath);

      // Actualiza la información del libro en la base de datos
      const updateQuery = `UPDATE libro
                           SET titulo = COALESCE($2, titulo),
                               autor = COALESCE($3, autor),
                               genero = COALESCE($4, genero),
                               copiasdisponibles = COALESCE($5, copiasdisponibles),
                               sinopsis = COALESCE($6, sinopsis),
                               añopublicacion = COALESCE($7, añopublicacion),
                               portada = COALESCE($8, portada)
                           WHERE isbn = $1`;

      await db.none(updateQuery, [isbn, titulo, autor, genero, copiasdisponibles, sinopsis, aniopublicacion, req.file.filename]);

      res.json({ status: 'ok', message: 'Libro actualizado exitosamente' });
    } else {
      // No se proporcionó una nueva portada, solo actualiza la información sin cambiar la portada
      const updateQueryWithoutPortada = `UPDATE libro
                                         SET titulo = COALESCE($2, titulo),
                                             autor = COALESCE($3, autor),
                                             genero = COALESCE($4, genero),
                                             copiasdisponibles = COALESCE($5, copiasdisponibles),
                                             sinopsis = COALESCE($6, sinopsis),
                                             aniopublicacion = COALESCE($7, añopublicacion)
                                         WHERE isbn = $1`;

      await db.none(updateQueryWithoutPortada, [isbn, titulo, autor, genero, copiasdisponibles, sinopsis, aniopublicacion]);

      res.json({ status: 'ok', message: 'Libro actualizado exitosamente' });
    }
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
