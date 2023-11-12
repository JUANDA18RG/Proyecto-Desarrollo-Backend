const {getUserByUsername, getBookByISBN} = require('./task.controllers.js');
const { format, add, parseISO } = require('date-fns');
const db = require('../db.js');

async function booking (req, res)
{
    const username = req.username;
    const book = req.body.book;
    const time = parseInt(req.body.time);


    // VALIDACIONES
    if (!(Number.isInteger(time))  || !(time >= 0) || !(time === 8 || time === 15 || time === 30)) 
    {
        return res.status(400).
        send({message : 'El tiempo indicado debe ser uno de los siguientes números enteros: 8, 15, 30.'});
    }
    
    const userExist = await getUserByUsername(username);
    const bookExist = await getBookByISBN(book);

    if(!userExist)
    {
        return res.status(400).
        send({message : 'El usuario no existe'});
    }

    if(!bookExist)
    {
        return res.status(400).send({message : 'El libro no existe'});
    }


    const fechaActual = new Date();
    const fechaReserva = format(fechaActual, 'yyyy-MM-dd');


    const nuevaFecha = add(parseISO(fechaReserva), {days: time});
    const fechaDevolucion = format(nuevaFecha, 'yyyy-MM-dd');

    //crear reserva

    db.one('INSERT INTO reserva (estado, fechaReserva, fechaDevolucion, libro, usuario) VALUES($1, $2, $3, $4, $5) RETURNING id' , ['Reservado', fechaReserva, fechaDevolucion, book, username])
    .then(resultado => {
        return res.status(200).send({id: resultado.id, message: 'La reserva fue realizada exitosamente' });
    }).
    catch(error=>
    {
      return res.status(400).send({status: 'Reserva no creada', message: 'Fallo al intentar realizar la reserva'});
    })
}

module.exports = booking;