const fsql = require('./task.controllers.js');
const db = require('../db.js');

async function realizarComentario (req, res)
{
    const username = req.username;
    const book = req.body.book;
    const valoracion = req.body.valoracion;
    const comentario = req.body.comentario;

    // VALIDACIONES
    if (!(Number.isInteger(valoracion)) || !(valoracion === 1 || valoracion === 2 || valoracion === 3 || valoracion === 4 || valoracion === 5)) 
    {
        return res.status(400).
        send({message : 'La valoración debe estar entre uno y cinco'});
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


}




module.exports = realizarComentario;