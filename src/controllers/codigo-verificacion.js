const fsql = require('./task.controllers.js');

const validarCod = async (req, res) => {
    try{
        const codigo = req.body.codigo;
        const user = await fsql.getUsernameByCodigo(codigo);
        if(user){
            return res.status(200).json({
                success: true,
                message: 'Codigo correcto'
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Codigo incorrecto'
        });
    }catch (error){
        console.error('Error al validar el codigo', error);
        return res.status(500).json({
            success: false,
            message: 'Error al validar el codigo'
        });
}
}

module.exports = validarCod;


