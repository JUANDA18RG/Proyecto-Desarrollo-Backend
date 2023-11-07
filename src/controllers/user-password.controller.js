const fsql = require('./task.controllers.js');
const nodemailer = require('nodemailer');
const credentials = require('../utils/credentials.util.js');


 const sendEmailToResetPassword =  async (req, res) => {
    try {

      const email = req.body.email;

      const user = await fsql.getUserByCorreo(email);
      
      if(!user) {
        return res.status(400).json({
          success: false,
          msg: 'El email es incorrecto'
        });
      }


      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'Bookfinder553@gmail.com',
          pass: 'wlzx ezrk qfyr ffjv'
        }
      });
      const codigo = credentials.generateRandomString(6);  // aqui voy a guardar este codigo en la base de datos
      let mailOptions = {
        from: 'Bookfinder553@gmail.com',
        to: email,
        subject: "Reset Password",
        text: `este es el codigo ${codigo} \npara recuperar la contraseña debes ingresarlo en la pagina`
      };
    
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          return res.status(500).send({
            success: false,
            message: 'Error al enviar el email'
          });
        } else {
          console.log('Email sent: ' + info.response);
          try{ // se guarda temporalmente el codigo de recuperacion en la base de datos
            if(user[1]){
              fsql.setIntoCodigo('administrador', user[0], codigo);

            }else{
              fsql.setIntoCodigo('usuario', user[0], codigo);

            }
            }catch(error){
            console.error('Error al guardar el codigo de recuperacion', error);
            res.status(500).send({
              success: false,
              message: 'Error al guardar codigo intente nuevamente'
            });
          }

          return res.status(200).send({
            success: true,
            message: 'El email se envio correctamente'
          });

        }
      });
    }catch(error){
      return res.status(500).send({
        success: false,
        message: 'Error al encontrar email'
      });
    }
}






module.exports = sendEmailToResetPassword;


//sendEmail('recipient-email@gmail.com', 'Password Reset', 'Here is your password reset link...');