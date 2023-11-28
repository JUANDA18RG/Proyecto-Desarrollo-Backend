const db = require('../db.js');
const {getUserByCorreo, getBookByISBN} = require('./task.controllers.js');

async function deleteB(req,res)
{
    try
    {
        username = req.username;
        correo = req.correo;
        book = req.body.book;
        const isAdmin = await getUserByCorreo(correo);
        const existBook = await getBookByISBN(book);

        if(isAdmin === null)
        {
            return res.status(400).send({message: 'El usuario no existe'});
        }

        if( isAdmin[1] === false)
        {
            return res.status(400).send({message: 'El usuario no es un administrador'});
        }

        if(existBook === null)
        {
            return res.status(400).send({message: 'El libro no existe'});
        }

        if(!(existBook.cantcopias == existBook.copiasdisponibles))
        {
            return res.status(400).send({message: 'El libro no puede ser borrado, por favor verifique que no hayan reservas antes de borrar un libro.'})
        }

        await db.none('UPDATE reserva SET libro = null WHERE libro in ($1)', [book])
        await db.none('UPDATE valoraciones SET libro = null WHERE libro in ($1)',[book])
        await db.none('DELETE FROM libro WHERE isbn in ($1)', [book])
        .then(resultado =>
            {
                return res.status(200).send({message: "El libro ha sido eliminado correctamente."});
            })
        .catch(error => 
            {
                return error;
            });             
    }
    catch(error)
    {
        return error;
    }
}

module.exports = deleteB;