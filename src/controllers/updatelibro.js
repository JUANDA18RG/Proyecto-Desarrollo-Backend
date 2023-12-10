const db = require('../db.js');
const fsql = require('./task.controllers.js');
const fs = require('fs').promises;
const path = require('path');

// Ruta donde se almacenan las imágenes de portada (ajústala según tu estructura)
const uploadPath = path.join(__dirname, '..', 'assets');

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
  const isbn = req.params.isbn;
  const correo = req.correo;
  const admin = req.username;
  const { titulo, autor, genero, sinopsis} = req.body;
  let {aniopublicacion, cantcopias} = req.body;
  try {
    // verificar que la persona tenga permisos de administrador
    const administrador = await fsql.getUserByCorreo(correo);
    if(!administrador){
      return res.status(403).json({ error: 'No tienes permisos para realizar esta acción el usuario no se encontró' });
    }

    if(!administrador[1]){
      return res.status(403).json({ error: 'No tienes permisos de administrador para realizar esta acción' });
    }


    const libroExistente = await db.oneOrNone('SELECT * FROM libro WHERE isbn = $1', isbn);
    if (!libroExistente) {
      if(req.file){
        await fs.unlink(req.file.path);
      }
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    if(cantcopias){
    cantcopias = parseInt(cantcopias);
    if(isNaN(cantcopias)){
      return res.status(400).json({ error: 'La cantidad de copias debe ser un número' });
    }
    }

    if(aniopublicacion){
      aniopublicacion = parseInt(aniopublicacion);
      if(isNaN(aniopublicacion)){
        return res.status(400).json({ error: 'El año de publicación debe ser un número' });
      }
    }
    

    // Calcula el nuevo valor para copiasdisponibles
    if(cantcopias <= 0){
      return res.status(400).json({ error: 'No se puede actualizar el libro porque la cantidad de copias debe ser mayor a 0 si lo que quieres es '+
                                           'quitar todas las copias sería mejor eliminar el libro' });
    }
    let copias = 0;
    if(cantcopias){
      if(cantcopias === libroExistente.cantcopias){
      copias = 0;
      }else if(cantcopias > libroExistente.cantcopias){
        copias = cantcopias - libroExistente.cantcopias;
      }else{
        copias = cantcopias - libroExistente.cantcopias;
        if((libroExistente.copiasdisponibles + copias) < 0){
          return res.status(400).json({ error: 'No se puede actualizar el libro porque la cantidad de '
                                      + 'copias disponibles es insuficiente para este proceso' });
        }
      }
    }
    const copiasDisponibles = libroExistente.copiasdisponibles + copias;

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
          copiasdisponibles = COALESCE($9, copiasdisponibles) WHERE isbn = $1`;
    // Usa null si req.file.filename no está definido
    const filename = req.file ? `/${req.file.filename}` : null;

    await db.none(updateQuery, [isbn, titulo, autor, genero, cantcopias, sinopsis, aniopublicacion, filename, copiasDisponibles]);
    await fsql.agregarControlLibro(isbn,admin);
    
    if (req.file && req.file.filename) {
      // Elimina la portada anterior si existe
      if (libroExistente.portada) {
        const portadaPath = path.join(uploadPath, libroExistente.portada);
        await fs.unlink(portadaPath);
      }
    }

    res.json({ status: 'ok', message: 'Libro actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    try{
    if(req.file){
      await fs.unlink(req.file.path);
    }
  }catch(error){
     res.status(500).json({ error: 'Error que no pudo ser prevenido' });
    }
    res.status(500).json({ error: 'Error al actualizar el libro' });
  }
}

module.exports = {
  getAllLibros,
  getLibroByTitulo,
  updateLibro,
};

