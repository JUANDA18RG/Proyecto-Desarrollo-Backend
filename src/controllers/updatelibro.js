async function updateLibro(req, res) {
  const isbn = req.params.isbn;
  const { titulo, autor, genero, cantcopias, sinopsis, anioPublicacion } = req.body;

  try {
    const libroExistente = await db.oneOrNone('SELECT * FROM libro WHERE isbn = $1', isbn);
    if (!libroExistente) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    // Verifica si se proporciona una nueva portada en la solicitud
    if (req.file) {
      // Elimina la portada anterior si existe
      if (libroExistente.portada) {
        const portadaPath = path.join(uploadPath, libroExistente.portada);
        await fs.unlink(portadaPath);
      }

      // Guarda la nueva portada en la carpeta de subidas
      const nuevaPortadaPath = path.join(uploadPath, req.file.filename);
      await fs.rename(req.file.path, nuevaPortadaPath);
    }

    // Calcula el nuevo valor para copiasdisponibles
    const nuevasCopiasDisponibles = Math.max(0, libroExistente.cantreservas - cantcopias);

    // Actualiza la información del libro en la base de datos
    const updateQuery = `
      UPDATE libro
      SET titulo = COALESCE($2, titulo),
          autor = COALESCE($3, autor),
          genero = COALESCE($4, genero),
          cantcopias = COALESCE($5, cantcopias),
          sinopsis = COALESCE($6, sinopsis),
          anioPublicacion = COALESCE($7, anioPublicacion),
          portada = COALESCE($8, portada),
          copiasdisponibles = $9
      WHERE isbn = $1`;

    await db.none(updateQuery, [isbn, titulo, autor, genero, cantcopias, sinopsis, anioPublicacion, req.file.filename, nuevasCopiasDisponibles]);

    res.json({ status: 'ok', message: 'Libro actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el libro' });
  }
}
