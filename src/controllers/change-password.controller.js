const  fslq  = require("./task.controllers");
const Credentials = require("../utils/credentials.util");

const changePassword = async (req, res) => {
  try{
    const {correo, password} = req.body;
    const user = await fslq.getUserByCorreo(correo);
    const passwordHash = await Credentials.generateHash(password);
    if(!user){
      return res.status(401).json({
        success: false,
        message: "El usuario no existe",
      });
    }else{
      const actualizar = await fslq.UpdatePassword(user[0].username, passwordHash);
      await fslq.deleteCodigo(user[0].username);
      if(!actualizar){
        return res.status(401).json({
          success: false,
          message: "El usuario no existe",
        });
      }else{
        return res.status(200).json({
          success: true,
          message: "Contraseña actualizada",
        });
      }
    }
  }catch(error){
    console.error("Error al cambiar la contraseña o borrar codigo", error);
    return res.status(500).json({
      success: false,
      message: "Error al cambiar la contraseña o borrar codigo",
    });
  }

}
module.exports = changePassword;



