const fsql = require('./task.controllers');
const db = require('../db.js');

const deleteAdmin = async (req, res) => 
{
    try
    {
        const user = await fsql.getUserByCorreo(req.correo); // username de superadmin
        const admin_to_delete = req.params.username; //username de admin a ser eliminado
        const admin = await fsql.getUserByUsername(admin_to_delete); 
        console.log(admin);


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


const getAdmin = async (req, res) => 
{
    try
    {
        const lista = await fsql.getallAdmin();
        return res.status(200).json(lista);
    }
    catch(err)
    {
        console.error('Error al traer los administradores', err);
        return res.status(500)
    }
}

async function return_administrador(req, res) {
    try{
        const username = req.params.username;
        const Administrador = await fsql.getAdmin(username);
        if(Administrador){
            return res.status(200).json(Administrador);
        }
        return res.status(404).json({message: 'No se encontró el usuario'});

    }catch(error){
        console.error('Error al buscar Administrador ', error);
        return res.status(500).json({message: 'Error al buscar administrador'});
    }
}





module.exports = {deleteAdmin,getAdmin, return_administrador};
