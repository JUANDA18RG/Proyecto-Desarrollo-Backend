const db = require('../db.js');

async function getAllReservas(req, res) {
  try {
    const reservas = await db.any('SELECT * FROM Reserva');
    res.status(200).json({ reservas });
  } catch (error) {
    console.error('Error al obtener todas las reservas', error);
    res.status(500).json({ message: 'Error al obtener todas las reservas' });
  }
}



module.exports = {
  getAllReservas,

};
