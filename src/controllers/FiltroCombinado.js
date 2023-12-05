const db = require('../db.js');

// Controlador para filtrar libros
async function filtrarLibros(req, res) {
  try {
    // Obtener parámetros de la solicitud
    const { titulo, autor, estado, genero, añoPublicacion, fechaPublicacion, diaPublicacion } = req.body;

    // Construir la consulta base
    let query = 'SELECT * FROM libro WHERE 1 = 1';

    // Agregar condiciones según los parámetros proporcionados
    if (titulo) {
      query += ` AND titulo ILIKE '%${titulo}%'`;
    }

    if (autor) {
      query += ` AND autor ILIKE '%${autor}%'`;
    }

    if (estado) {
      query += ` AND estado = '${estado}'`;
    }

    if (genero) {
      query += ` AND genero ILIKE '%${genero}%'`;
    }

    if (añoPublicacion) {
      query += ` AND "añoPublicacion" = ${añoPublicacion}`;
    }

    if (fechaPublicacion) {
      query += ` AND "fechaPublicacion" = '${fechaPublicacion}'`;
    }

    if (diaPublicacion) {
      query += ` AND EXTRACT(DOW FROM "fechaPublicacion") = ${diaPublicacion}`;
    }

    // Ejecutar la consulta
    const librosFiltrados = await db.any(query);

    // Devolver los resultados
    res.json(librosFiltrados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al filtrar los libros' });
  }
}

module.exports = {
  filtrarLibros,
};
