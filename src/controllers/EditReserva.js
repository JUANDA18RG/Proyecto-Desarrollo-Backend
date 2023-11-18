const fsql = require('../controllers/task.controllers.js');
const { add } = require('date-fns');
const {formatFecha} = require('./functions.Used.js');

async function actualizarFechaDevolucion(req, res) {
  const { id, time } = req.body;
  const username = req.username;
  try{
    const reserva = await fsql.getReservaById(id); // función que busca la reserva por id
    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }else if(reserva.usuario !== username){
      return res.status(400).json({ message: `La reserva solo puede ser modificada por su creador ${username}` });
    }
  
    if(!(reserva.estado == "Reservado")){
      return res.status(400).json({ message: 'La reserva no puede ser modificada' });
    }


    if (!(Number.isInteger(time))  || !(time >= 0) || !(time === 8 || time === 15 || time === 30)) 
    {
        return res.status(400).
        send({message : 'El tiempo indicado debe ser uno de los siguientes números enteros: 8, 15, 30.'});
    }
    let fechaDevolucion = add(reserva.fechareserva, {days: time});


    reserva.fechadevolucion = fechaDevolucion;
    fechaDevolucion = fechaDevolucion.toISOString().split('T')[0];
    await fsql.updateFechaDevolucion(reserva.id, fechaDevolucion); // función que actualiza la reserva en la base de datos

    // aqui voy a cambiar el formato de la fecha para devolverla bonita
    
    return res.status(200).json({ message: 'Cambio exitoso', fechaDevolucion: formatFecha(reserva.fechadevolucion) });
  }catch(error){
    console.error('Error al usar la base de datos', error);
    return res.status(500).json({ message: 'Error al usar la base de datos' });
  }
}

module.exports = actualizarFechaDevolucion;


// falta implementar funcion que se ejecute cada dia temprano verificando
// si hay reservas vencidas y cambiar su estado a vencido, tambien si las reservas vencidas
// estaban en estado de reservado, se debe sumar 1 a el libro reservado para que se ponga disponible
// y ademas poner el estado de la reserva de nuevo en devuelto ya que no fue por el libro que pidió.
// Verificar que el libro no este en estado devuelto cuando se pase el tiempo de devolución
// para que no se cambie el estado a vencido ya que ya ha sido devuelto.