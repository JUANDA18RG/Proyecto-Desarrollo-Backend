const db = require('../db.js');

async function obtenerHistorialReservas(req, res) {
  const { usuario } = req.params;

  try {
    const historialReservas = await db.any(
      'SELECT R.id, R.estado, R.fechaReserva, R.fechaDevolucion, R.libro, L.titulo, L.portada ' +
      'FROM Reserva R ' +
      'JOIN Libro L ON R.libro = L.isbn ' +
      'WHERE R.usuario = $1',
      [usuario]
    );

    if (historialReservas.length === 0) {
      return res.status(404).json({ message: 'El usuario no tiene ninguna reserva' });
    }

    const resultadoFormateado = historialReservas.map(reserva => {
      return {
        id: reserva.id,
        estado: reserva.estado,
        fechaReserva: reserva.fechareserva,
        fechaDevolucion: reserva.fechadevolucion,
        libro: {
          isbn: reserva.libro,
          titulo: reserva.titulo,
          portada: reserva.portada,
        },
      };
    });

    return res.status(200).json(resultadoFormateado);
  } catch (error) {
    console.error('Error al obtener historial de reservas', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = obtenerHistorialReservas;
