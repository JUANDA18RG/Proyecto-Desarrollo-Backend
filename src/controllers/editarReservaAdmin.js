// Ruta para cambiar el estado de una reserva
router.put('/cambiarEstadoReserva/:id', async (req, res) => {
  const { id, nuevoEstado } = req.body;
  const username = req.username;

  try {
    const reserva = await taskControllers.getReservaById(id);

    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    } else if (reserva.usuario !== username) {
      return res.status(400).json({ message: `La reserva solo puede ser modificada por su creador ${username}` });
    }

    // Validar que el nuevo estado sea válido
    if (!['Reservado', 'Entregado', 'Vencido', 'Devuelto', 'Cancelado'].includes(nuevoEstado)) {
      return res.status(400).json({ message: 'Estado no válido' });
    }

    // Actualizar el estado de la reserva en la base de datos
    await taskControllers.cambiarEstadoReserva(reserva.id, nuevoEstado);

    return res.status(200).json({ message: 'Cambio exitoso', nuevoEstado });
  } catch (error) {
    console.error('Error al usar la base de datos', error);
    return res.status(500).json({ message: 'Error al usar la base de datos' });
  }
});
