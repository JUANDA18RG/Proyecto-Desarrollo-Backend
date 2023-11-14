const fsql = require('./task.controllers.js');
const db = require('../db.js');
const FuzzySearch = require('fuzzy-search');

async function searchCombined(req, res) {
  try {
    const { genero, autor, titulo, aniopublicacion } = req.params;
    const filters = [];
    const values = [];

    if (genero) {
      filters.push('genero = $1');
      values.push(genero);
    }

    if (autor) {
      filters.push('autor = $2');
      values.push(autor);
    }

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

      return res.status(200).send({ message: 'Búsqueda exitosa', data: searchResult });
    }

    if (aniopublicacion) {
      filters.push('aniopublicacion = $3');
      values.push(parseInt(aniopublicacion));
    }

    if (filters.length === 0) {
      return res.status(400).send({ error: 'Se requiere al menos un criterio de búsqueda' });
    }

    const query = `SELECT * FROM libro WHERE ${filters.join(' AND ')}`;
    const data = await db.any(query, values);

    if (data.length > 0) {
      return res.status(200).send({ message: 'Búsqueda exitosa', data });
    } else {
      return res.status(404).send({ status: 'No se encontraron resultados', message: 'Filtro vacío' });
    }
  } catch (error) {
    console.error('Error al realizar la búsqueda combinada', error);
    return res.status(500).send({ status: 'Error', message: 'Error interno del servidor' });
  }
}

module.exports = {
  searchCombined,
};
