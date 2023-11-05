const fsql = require('./task.controllers.js');
const db = require('../db.js');
//db.connect();

async function searchByGenre (req, res)
{
    const genero = req.params.genero;
    console.log(genero);

    db.any('select * from libro where genero = ($1)',[genero])
  .then(data => 
    {
        if(data[0] != null)
        {
            return res.status(200).send({message:'Filtro exitoso', data});
        }
        return res.status(404).send({status: `No existen libros de ${genero}`, message: 'Filtro vacio'});
    
    })
  .catch(error => {
    return res.status(400).send({status: 'Error', message: 'Fallo al intentar encontrar el genero'});
  });
}




async function searchByAuthor (req, res)
{
  console.log('hola');
  const autor = req.params.autor;


  db.any('select * from libro where autor = ($1)',[autor])
  .then(data => 
    {
        if(data[0] != null)
        {
            return res.status(200).send({message:  'Filtro exitoso', data});
        }
        return res.status(404).send({status: `No existen libros de ${autor}`, message: 'Filtro vacio'});
    
    })
  .catch(error => {
    return res.status(400).send({status: 'Error', message: 'Fallo al intentar encontrar el autor'});
  });
}


module.exports = {
                    searchByAuthor,
                    searchByGenre
                };