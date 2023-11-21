const db = require('../db.js');

async function obtenerHistorialValoraciones(req, res) {
  const { usuario } = req.params;

  try {
    const historialValoraciones = await db.any(
      'SELECT V.id, V.comentario, V.valoracion, V.libro, L.titulo, L.portada ' +
      'FROM Valoraciones V ' +
      'JOIN Libro L ON V.libro = L.isbn ' +
      'WHERE V.usuario = $1',
      [usuario]
    );

    if (historialValoraciones.length === 0) {
      return res.status(404).json({ message: 'El usuario no tiene ninguna valoración' });
    }

    const resultadoFormateado = historialValoraciones.map(valoracion => {
      return {
        id: valoracion.id,
        comentario: valoracion.comentario,
        valoracion: valoracion.valoracion,
        libro: {
          isbn: valoracion.libro,
          titulo: valoracion.titulo,
          portada: valoracion.portada,
        },
      };
    });

    return res.status(200).json(resultadoFormateado);
  } catch (error) {
    console.error('Error al obtener historial de valoraciones', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function eliminarValoracion(req, res) {
  const { id } = req.params;

  try {
    const resultado = await db.result('DELETE FROM Valoraciones WHERE id = $1', [id]);

    if (resultado.rowCount === 0) {
      return res.status(404).json({ message: 'La valoración no existe' });
    }

    return res.status(200).json({ message: 'Valoración eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la valoración', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = {
  obtenerHistorialValoraciones,
  eliminarValoracion,
};
