const fsql = require('../controllers/task.controllers.js');
const { add } = require('date-fns');
const { formatFecha } = require('./functions.Used.js');

async function editarReservaAdmin(req, res) {
  const { username, isbn, nuevoEstado } = req.body;

  try {
    // Verificar si el libro con el ISBN existe en la base de datos
    const libro = await fsql.getLibroByISBN(isbn);
    if (!libro) {
      return res.status(404).json({ message: 'El libro no se encuentra registrado. Verifique el ISBN.' });
    }

    // Obtener todas las reservas del usuario para el libro con el ISBN dado
    const reservasUsuario = await fsql.getReservasByUsuarioYLibro(username, isbn);

    if (reservasUsuario.length === 0) {
      return res.status(404).json({ message: 'No se encontraron reservas para el usuario y el libro especificados.' });
    }

    // Verificar que el nuevo estado sea uno de los permitidos
    const estadosPermitidos = ['Reservado', 'Prestado', 'Devuelto'];
    if (!estadosPermitidos.includes(nuevoEstado)) {
      return res.status(400).json({ message: 'El nuevo estado no es válido. Debe ser uno de los siguientes: Reservado, Prestado, Devuelto.' });
    }

    // Actualizar el estado de todas las reservas encontradas
    await Promise.all(reservasUsuario.map(async (reserva) => {
      reserva.estado = nuevoEstado;
      await fsql.updateEstadoReserva(reserva.id, nuevoEstado);
    }));

    return res.status(200).json({ message: 'Reservas actualizadas exitosamente.' });
  } catch (error) {
    console.error('Error al usar la base de datos', error);
    return res.status(500).json({ message: 'Error al usar la base de datos' });
  }
}

module.exports = editarReservaAdmin;
