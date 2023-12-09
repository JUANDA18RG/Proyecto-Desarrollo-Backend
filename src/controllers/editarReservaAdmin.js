// Ruta para cambiar el estado de una reserva
const {cambiarEstadoReserva, getUserByCorreo,getReservaById, agregarControlReserva}= require('./task.controllers.js');


async function actualizarEstado (req, res)
{ 

  try 
  {
    const {nuevoEstado } = req.body;
    const id = req.params.id;
    const usuario = req.username;
    const correo = req.correo;
    const reserva = await getReservaById(id);
    const isAdmin = await getUserByCorreo(correo);


    console.log(usuario);
    console.log(reserva);

    if (isAdmin == null)
    {
      return res.status(400).send({message: 'El usuario no existe'});
    }

    if (!(isAdmin[1]))
    {
      return res.status(400).send({message: 'El usuario no es un administrador'});
    }
 
    if (!reserva) 
    {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    // Validar que el nuevo estado sea válido
    if (![ 'Entregado', 'Devuelto'].includes(nuevoEstado)) 
    {
      return res.status(400).json({ message: 'Estado no válido' });
    }


    const cambio = await cambiarEstadoReserva(reserva.id, nuevoEstado);

    if(cambio)
    {
      await agregarControlReserva(reserva.id,usuario);
      return res.status(200).json({ message: 'Cambio exitoso', nuevoEstado });
    }
    else
    {
      return res.status(400).json({ message: 'Cambio no exitoso'});
    }
    
  } catch (error) {
    console.error('Error al usar la base de datos', error);
    return res.status(500).json({ message: 'Error al usar la base de datos' });
  }
}

module.exports = actualizarEstado;