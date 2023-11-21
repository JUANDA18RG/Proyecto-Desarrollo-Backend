const {getUserByUsername,getBookByISBN, commentEx} = require('./task.controllers.js');
const db = require('../db.js');

async function realizarComentario (req, res)
{
    const username = req.username;
    const book = req.body.book;
    const valoracion = req.body.valoracion;
    const comentario = req.body.comentario;

    // VALIDACIONES
    if (!valoracion === null)
    {
        if ( !(valoracion === 1 || valoracion === 2 || valoracion === 3 || valoracion === 4 || valoracion === 5)) 
        {
            return res.status(400).
            send({message : 'La valoración debe estar entre uno y cinco'});
        }

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

    const commentExist = await commentEx(username, book);
    if(commentExist)
    {
        return res.status(406).send({message : 'El usuario ya hizo un comentario en el libro'});
    }

    if(valoracion === null)
    {
        db.none('INSERT INTO valoraciones (comentario, valoracion, usuario, libro) VALUES($1, $2, $3, $4)' , [comentario, null, username, book])
        .then(resultado => {
             return res.status(200).send({message: 'La valoración fue realizada exitosamente'});
        }).
        catch(error=>
        {
            return res.status(400).send({status: 'Valoración no creada', message: 'Fallo al intentar realizar la valoración'});
        })
    }

    if(!(valoracion === null))
    {
        db.none('INSERT INTO valoraciones (comentario, valoracion, usuario, libro) VALUES($1, $2, $3, $4)' , [comentario, parseInt(valoracion), username, book])
        .then(resultado => {
            return res.status(200).send({message: 'La valoración fue realizada exitosamente'});
        }).
        catch(error=>
        {
            return res.status(400).send({status: 'Valoración no creada', message: 'Fallo al intentar realizar la valoración'});
        })
    }

}

module.exports = realizarComentario;