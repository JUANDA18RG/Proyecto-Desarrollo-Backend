const db = require('../db.js');
const {getUserByCorreo, getBookByISBN} = require('./task.controllers.js');

async function deleteB(req,res)
{
    username = req.username;
    correo = req.correo;
    book = req.body.book;
    const isAdmin = await getUserByCorreo(correo);
    const existBook = await getBookByISBN(book);
    console.log(isAdmin);

    if(isAdmin[1] === false || isAdmin[2].jefe != null)
    {
        return res.status(400).send({message: 'El usuario no es un super admin'});
    }

    if(isAdmin === null)
    {
        return res.status(400).send({message: 'El usuario no existe'});
    }

    if(existBook === null)
    {
        return res.status(400).send({message: 'El libro no existe'});
    }

    if(!(existBook.cantcopias == existBook.copiasdisponibles))
    {
        return res.status(400).send({message: 'El libro no puede ser borrado, por favor verifique que no hayan reservas antes de borrar un libro.'})
    }


    db.none('UPDATE reserva SET libro = null WHERE libro in ($1)', [book]);
    db.none('UPDATE valoraciones SET libro = null WHERE libro in ($1)', [book]);
    db.none('DELETE FROM libro WHERE isbn in ($1)', [book]).then(resultado => 
        {
            return res.status(200).send({message: "El libro ha sido eliminado correctamente."});
        });
}

module.exports = deleteB;