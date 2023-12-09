const fsql = require('./task.controllers');

const deleteAdmin = async (req, res) => 
{
    try
    {
        const user = await fsql.getUserByCorreo(req.correo); // username de superadmin
        const admin_to_delete = req.params.username; //username de admin a ser eliminado
        const admin = await fsql.getUserByUsername(admin_to_delete); 


        if (!user)
        {
            return res.status(400).send({message: 'El usuario no existe'});
        }
        if(!(user.jefe == null))
        {
            return res.status(400).send({message: 'El usuario no tiene permitido eliminar administradores'});
        }
        if(!admin)
        {
            return res.status(400).send({message: 'El administrador a ser borrado no exististe'});
        }
        if(admin.jefe == null)
        {
            return res.status(400).send({message: 'No se puede borrar un superadministrador'});
        }

        await fsql.deleteAdmin(admin_to_delete);
        return res.status(200).send({message: 'El administrador ha sido borrado correctamente'});
    }
    catch(err)
    {
        console.error('Error al borrar administrador', err);
        return res.status(500).json({message: 'Error al borrar incidencias intentelo nuevamente'});
    }
}

module.exports = {deleteAdmin};
