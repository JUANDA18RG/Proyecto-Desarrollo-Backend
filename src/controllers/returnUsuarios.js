const fsql = require('./task.controllers');

async function return_usuarios(req, res) {
    try{
        const usuarios = await fsql.getallUsers();
        if(usuarios){
            return res.status(200).json(usuarios);
        }
        return res.status(404).json({message: 'No se encontrario usuarios'});

    }catch(error){
        console.error('Error al buscar usuarios', error);
        return res.status(500).json({message: 'Error al buscar usuarios'});
    }
}

async function return_usuario(req, res) {
    try{
        const username = req.params.username;
        const usuario = await fsql.getUser(username);
        if(usuario){
            return res.status(200).json(usuario);
        }
        return res.status(404).json({message: 'No se encontró el usuario'});

    }catch(error){
        console.error('Error al buscar usuario', error);
        return res.status(500).json({message: 'Error al buscar usuario'});
    }
}



module.exports = {return_usuarios, return_usuario};
