const fsql = require('./task.controllers.js');
const db = require('../db.js');
const FuzzySearch = require('fuzzy-search');
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


async function searchByAnioPublicacion(req, res) {
  const aniopublicacion = parseInt(req.params.aniopublicacion);

  db.any('select * from libro where aniopublicacion = $1', [aniopublicacion])
    .then(data => {
      if (data[0] != null) {
        return res.status(200).send({ message: 'Filtro exitoso', data });
      }
      return res.status(404).send({
        status: `No existen libros publicados en el año ${aniopublicacion}`,
        message: 'Filtro vacío',
      });
    })
    .catch(error => {
      return res.status(400).send({
        status: 'Error',
        message: 'Fallo al intentar encontrar libros por año de publicación',
      });
    });
}

// funcion de uso de la libreria fuzzy-search para realizar busquedas difusas a los titulos de los libros 
// para devolver los libros que tengan coincidencias con lo que ingresa el usuario
const searchByTitleDifused = async (req, res) => {
 
  try {
  const books = await fsql.getallBooks();
  const titulo = req.body.titulo;
  
  if (!books) {
    return res.status(404).send({ error: 'No hay libros registrados en la base de datos' });
  }

  const searcher = new FuzzySearch(books, ['titulo'], {
    caseSensitive: false,
  });

  const searchResult = searcher.search(titulo);
  if (searchResult.length === 0) {
    return res.status(404).send({ error: 'No se encontraron coincidencias con el titulo ingresado' });
  }
  return res.status(200).send({ message: 'Busqueda exitosa', data: searchResult });

  }catch(error){
    console.error('Error al obtener los libros', error);
    response.status(500).send({
        error: error.message
    });
  }



}

async function searchCombined(req, res) {
  try {
    const { titulo, aniopublicacion, genero, autor } = req.body;

    if (titulo || aniopublicacion || genero || autor) {
      const filters = [];
      const values = [];

      let index = 1; // Iniciar el índice de marcadores de posición

      if (titulo) {
        const books = await fsql.getallBooks();

        if (!books) {
          return res.status(404).send({ error: 'No hay libros registrados en la base de datos' });
        }

        const searcher = new FuzzySearch(books, ['titulo'], {
          caseSensitive: false,
        });

        const searchResult = searcher.search(titulo);
        if (searchResult.length === 0) {
          return res.status(404).send({ error: 'No se encontraron coincidencias con el título ingresado' });
        }

        filters.push(`titulo ILIKE $${index}`);
        values.push(`%${titulo}%`);
        index++;
      }

      if (aniopublicacion) {
        filters.push(`aniopublicacion = $${index}`);
        values.push(parseInt(aniopublicacion));
        index++;
      }

      if (genero) {
        filters.push(`genero ILIKE $${index}`);
        values.push(`%${genero}%`);
        index++;
      }

      if (autor) {
        filters.push(`autor ILIKE $${index}`);
        values.push(`%${autor}%`);
        index++;
      }

      const query = `SELECT * FROM libro${filters.length > 0 ? ' WHERE ' + filters.join(' AND ') : ''}`;
      console.log('Consulta SQL:', query);
      console.log('Valores de los parámetros:', values);

      const data = await db.any(query, values);

      if (data.length > 0) {
        return res.status(200).send({ message: 'Búsqueda exitosa', data });
      } else {
        return res.status(404).send({ status: 'No se encontraron resultados', message: 'Filtro vacío' });
      }
    } else {
      return res.status(400).send({ error: 'Se requiere al menos un criterio de búsqueda' });
    }
  } catch (error) {
    console.error('Error al realizar la búsqueda', error);
    return res.status(500).send({ status: 'Error', message: 'Error interno del servidor', error: error.message });
  }
}



module.exports = {
                    searchByAuthor,
                    searchByGenre,
                    searchByTitleDifused,
                    searchByAnioPublicacion,
                    searchCombined
                };