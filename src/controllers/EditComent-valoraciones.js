const fsql = require('./task.controllers.js');


const updateCommentAndRating = async (req, res) => {
    try {
        const { comentario, valoracion,isbn} = req.body;
        const username = req.username;

        const valoraciones = await fsql.getValoracion(isbn,username);
        //console.log(valoraciones);
        if(!valoraciones){
            return res.status(400).json({ message: `la valoracion a este libro del usuario ${username} no existe`});
        }



        if(!comentario && !valoracion){
            return res.status(400).json({ message: 'No hay valores para actualizar' });
        }

        if(valoracion){
            if(!Number.isInteger(valoracion) || valoracion < 0 || valoracion > 5){  
                return res.status(400).json({ message: 'valoracion no valida' });
            }else{
                await fsql.updateValoracion(valoracion,isbn,username);
            }
        }

        if(comentario){
            await fsql.updateComentario(comentario,isbn,username);
        }

        return res.status(200).json({ message: 'valores actualizados satisfactoriamente'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Fallo al actualizar los valores' });
    }
};

module.exports = updateCommentAndRating;
