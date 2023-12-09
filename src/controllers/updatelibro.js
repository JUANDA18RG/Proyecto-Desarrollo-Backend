const db = require('../db.js');
const fsql = require('./task.controllers.js');
const fs = require('fs').promises;
const path = require('path');

// Ruta donde se almacenan las imágenes de portada (ajústala según tu estructura)
const uploadPath = path.join(__dirname, '..', 'uploads');

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

// Controlador para buscar un libro por Título (insensible a mayúsculas/minúsculas y tildes)
async function getLibroByTitulo(req, res) {
  const titulo = req.params.titulo;

  try {
    const libro = await db.oneOrNone(`
      SELECT *
      FROM libro
      WHERE titulo ILIKE $1`, `%${titulo}%`);

    if (!libro) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    res.json(libro);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar el libro por Título' });
  }
}

// Controlador para actualizar un libro por ISBN
async function updateLibro(req, res) {
  try {
    const isbn = req.params.isbn;
    const admin = req.username;
    const { titulo, autor, genero, cantcopias, sinopsis, aniopublicacion } = req.body;
    const libroExistente = await db.oneOrNone('SELECT * FROM libro WHERE isbn = $1', isbn);
    if (!libroExistente) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    // Verifica si se proporciona una nueva portada en la solicitud
    if (req.file && req.file.filename) {
      // Elimina la portada anterior si existe
      if (libroExistente.portada) {
        const portadaPath = path.join(uploadPath, libroExistente.portada);
        await fs.unlink(portadaPath);
      }

      // Guarda la nueva portada en la carpeta de subidas
      const nuevaPortadaPath = path.join(uploadPath, req.file.filename);
      await fs.rename(req.file.path, nuevaPortadaPath);
    }

    // Calcula el nuevo valor para copiasdisponibles
    const nuevasCopiasDisponibles = Math.max(0, cantcopias - libroExistente.cantreservas);

    // Actualiza la información del libro en la base de datos
    const updateQuery = `
      UPDATE libro
      SET titulo = COALESCE($2, titulo),
          autor = COALESCE($3, autor),
          genero = COALESCE($4, genero),
          cantcopias = COALESCE($5, cantcopias),
          sinopsis = COALESCE($6, sinopsis),
          aniopublicacion = COALESCE($7, aniopublicacion),
          portada = COALESCE($8, portada),
          copiasdisponibles = $9
      WHERE isbn = $1`;

    // Usa null si req.file.filename no está definido
    const filename = req.file ? req.file.filename : null;

    await db.none(updateQuery, [isbn, titulo, autor, genero, cantcopias, sinopsis, aniopublicacion, filename, nuevasCopiasDisponibles]);
    await fsql.agregarControlLibro(isbn,admin);
    
    res.json({ status: 'ok', message: 'Libro actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el libro' });
  }
}

module.exports = {
  getAllLibros,
  getLibroByTitulo,
  updateLibro,
};

