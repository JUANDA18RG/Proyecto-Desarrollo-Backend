const db = require('../db.js');

const sendAllComments = async (req, res) => {
    const isbn = req.body.isbn;
    try
    {
        db.any('SELECT * FROM valoraciones WHERE libro = $1 ',[isbn])
        .then(resultado => {
            const val = JSON.stringify(resultado);
            return res.status(200).send({message: "Los comentarios se han enviado correctamente", val});
            
        })
    }
    catch(error)
    {
        console.error('Error al obtener las valoraciones', error);
        throw error;
    }
}


module.exports = sendAllComments;