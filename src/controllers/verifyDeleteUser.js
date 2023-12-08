const fsql = require('./task.controllers');


const verificacionUser = async (req, res) => {
    try{
        const {username} = req;
        const user = await fsql.getallUsername(username);
        if(!user){
            return res.status(404).json({message: 'Usuario no encontrado. El usuario ha sido eliminado',
                                         cierreSesion: true});
        }
        return res.status(200).json({message: 'Usuario encontrado',
                                    cierreSesion: false});

        }catch(error){
        console.error('Error al verificar usuario', error);
        return res.status(500).json({message: 'Error al verificar usuario por favor ingrese de nuevo',
                                    cierreSesion: true});
        }
    }

module.exports = verificacionUser;