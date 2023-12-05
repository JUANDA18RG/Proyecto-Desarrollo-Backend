const {getUserByUsername,getReservaById,cambiarEstadoReserva} = require('./task.controllers.js');
const db = require('../db.js');

async function cancelarReserva (req, res)
{
    try
    {
        const username = req.username;
        const reserva = req.params.id;
    
    
        const userExist = await getUserByUsername(username);
        const bookingExist = await getReservaById(reserva);
    
        if(!userExist)
        {
            return res.status(400).
            send({message : 'El usuario no existe'});
        }
        console.log(bookingExist);
    
        if(!bookingExist)
        {
            return res.status(400). send({message : 'La reserva no existe'});
        }
    
        if(!(bookingExist.estado == 'Reservado'))
        {
            return res.status(400). send({message : 'La reserva no puede ser cancelada'});
    
        }
        
        if(!(bookingExist.usuario == username))
        {
            return res.status(400). send({message : 'La reserva no coincide con el usuario'});
        }
    
        cambiarEstado = await cambiarEstadoReserva(reserva, 'Cancelado');
        if(cambiarEstado)
        {
            return res.status(200). send({message : 'La reserva ha sido cancelada exitosamente'});
        }
        else
        {
            return res.status(400). send({message : 'La reserva no ha podido ser cancelada'});
        }
    
    }
    catch(error)
    {
        return res.status(500).json({ message: 'Error al usar la base de datos' });
    }
}

module.exports = cancelarReserva;

