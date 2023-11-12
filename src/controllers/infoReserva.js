const fsql = require('../controllers/task.controllers.js');
const {formatFecha} = require('./functions.Used.js');

async function  obtenerInfoReserva(req, res) {
  const { id } = req.params;
  try{
    // Llama a la función getInfoReserva con el id de la reserva
  const reserva = await fsql.getInfoReserva(id);
  console.log(reserva);

  // Si la reserva no existe, retorna un error 404
  if (!reserva) {
    return res.status(404).json({ error: 'No se encontró reserva con ese ID' });
  }
  if(reserva.estado == 'Reservado'){
    // si el estado es reservado puede cancelar
    reserva.cancelacion = true;
  }else{
    // si el estado es Entregado, Vencido o Devuelto no puede cancelar
    reserva.cancelacion = false;
  }
  // formateo de las fechas para que se envien con mejor formato para usuarios
    const formatReserva = formatFecha(reserva.fechareserva);
    const formatDevolucion = formatFecha(reserva.fechadevolucion);

    reserva.fechareserva = formatReserva;
    reserva.fechadevolucion = formatDevolucion;
    console.log(reserva);

    // Si la reserva existe, la retorna
    return res.status(200).json(reserva);
  }catch(error){
    console.error('Error al obtener los libros', error);
    res.status(500).send({
        error: error.message
    });
  }
}

module.exports = obtenerInfoReserva;
