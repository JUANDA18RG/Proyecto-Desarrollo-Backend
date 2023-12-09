const db = require('../db.js');
const fs = require('fs');
const path = require('path');
const {getUserByCorreo, getBookByISBN,agregarControlLibro} = require('./task.controllers.js');

async function deleteB(req,res)
{
    try
    {
        username = req.username;
        correo = req.correo;
        book = req.body.book;
        const isAdmin = await getUserByCorreo(correo);
        const existBook = await getBookByISBN(book);
        const nombreImagen = existBook.portada;

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


        await db.tx(async t => {
            await t.none('UPDATE reserva SET libro = null WHERE libro in ($1)',[book]);
            await t.none('UPDATE valoraciones SET libro = null WHERE libro in ($1)',[book]);
            await t.none('UPDATE editarlibro SET libro = null WHERE libro in ($1)',[book]);
            
            const rutaAs = __dirname.replace('\controllers', '\assets');
            
            const ruta = path.join(rutaAs, nombreImagen);
             
            if (fs.existsSync(ruta))
            {
                await fs.unlink(ruta, (err) => 
                {
                    if (err) 
                    {
                        console.error('Error al eliminar el archivo:', err);
                    } 
                    else 
                    {
                        console.log('Archivo eliminado con éxito.');
                    }
                });
            } else 
            {
                console.log('El archivo no existe.');
            }
            await t.none('DELETE FROM libro WHERE isbn in ($1)', [book])
            .then(resultado =>
                {   
                    return res.status(200).send({message: "El libro ha sido eliminado correctamente."});
                })
            .catch(error => 
                {
                    return error;
                }); 
        });           
    }
    catch(error)
    {
        return error;
    }
}

module.exports = {deleteB};