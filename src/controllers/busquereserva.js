const db = require('../db.js');

async function listarReservas(req, res) {
  try {
    // Realiza una consulta para obtener todas las reservas
    const reservas = await db.any('SELECT * FROM Reserva');

    if (reservas.length === 0) {
      return res.status(404).json({ message: 'No hay reservas registradas' });
    }

    // Formatea el resultado si es necesario
    const resultadoFormateado = reservas.map(reserva => {
      return {
        id: reserva.id,
        estado: reserva.estado,
        fechaReserva: reserva.fechaReserva,
        fechaDevolucion: reserva.fechaDevolucion,
        libro: reserva.libro,
        usuario: reserva.usuario,
      };
    });

    // Devuelve la lista de reservas
    return res.status(200).json(resultadoFormateado);
  } catch (error) {
    console.error('Error al obtener la lista de reservas', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = {
  listarReservas,
};
