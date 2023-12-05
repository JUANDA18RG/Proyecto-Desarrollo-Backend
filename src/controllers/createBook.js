const { throws } = require('assert');
const psql = require('./task.controllers');
const fs = require('fs');

const deleteImage = (path) => {
    return new Promise((resolve, reject) => {
        fs.unlink(path, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

const createbook = async (req, res) => {
    try{
        const correo = req.correo;
        const isAdmin = await psql.getUserByCorreo(correo);
        console.log(isAdmin[1]);
        if(!isAdmin[1]){
            await deleteImage(req.file.path);
            return res.status(403).send({message: 'No tienes permiso para realizar esta acción'});
        }

        let {ISBN, Titulo, Autor, Genero, Cantcopias, anioPublicacion, descripcion} = req.body;
        const book = await psql.getBookByISBN(ISBN);

        if(book){
            await deleteImage(req.file.path);
            return res.status(409).send({message: 'El libro ya existe'});
        }

        Cantcopias = parseInt(Cantcopias);
        anioPublicacion = parseInt(anioPublicacion);

        if(isNaN(Cantcopias) || isNaN(anioPublicacion)){
            await deleteImage(req.file.path);
            return res.status(400).send({message: 'La cantidad de copias y el año de publicación deben ser números'});
        }
        if(anioPublicacion < 1400){
            await deleteImage(req.file.path);
            return res.status(400).send({message: 'El año de publicación no puede ser menor a 1400'});
        }
        if(Cantcopias < 1){
            await deleteImage(req.file.path);
            return res.status(400).send({message: 'no hay copias para ingresar el libro a la biblioteca'});
        }

        await psql.createBook(ISBN, Titulo, Autor, Genero, anioPublicacion, Cantcopias, descripcion, req.file.filename);

        return res.status(201).send({message: `libro ${Titulo} creado exitosamente`});

    }catch(error){
        console.log(error);
        await deleteImage(req.file.path);
        return res.status(500).send({message: 'no se pudo controlar el error',error});
    }
}


module.exports = createbook;