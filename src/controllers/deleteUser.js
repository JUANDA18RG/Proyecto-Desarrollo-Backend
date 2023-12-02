const fsql = require('./task.controllers');

const deleteUser = async (req, res) => {
  // funcion que borra todas las incidencias de un usuario
  try{
  const {correo} = req;
  const user = await fsql.getUserByCorreo(correo);
  const username_to_delete = req.params.username;

  const user_to_delete = await fsql.getallUsername(username_to_delete);
  console.log(user_to_delete);
  if(!user_to_delete){
    return res.status(404).json({message: 'Usuario no encontrado'});
  }
  if(user)
  {
    if(user[1])
    {
        await fsql.delete_in_user(username_to_delete);
        return res.status(200).json({message: 'Usuario borrado'});
    }
    return res.status(403).json({message: 'No tiene permisos para borrar usuarios'});
  }
  return res.status(404).json({message: 'administrador no encontrado intentelo nuevamente'});

  }catch(error){
    console.error('Error al borrar incidencias', error);
    return res.status(500).json({message: 'Error al borrar incidencias'});
    }
}

const deleteUserByUser = async (req, res) => {
try {
  const username = req.username;

  const  user = await fsql.getallUsername(username);
  if(!user){
    return res.status(404).json({message: 'Usuario no encontrado'});
  }

  await fsql.delete_in_user(username);
  return res.status(200).json({message: 'Usuario borrado'});

} catch (error) {
  console.error('Error al borrar incidencias', error);
  return res.status(500).json({message: 'Error al borrar incidencias intentelo nuevamente'});
}
}






module.exports = {deleteUser, deleteUserByUser};
