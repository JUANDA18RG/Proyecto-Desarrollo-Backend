const { request, response } = require("express");
const jwt = require("jsonwebtoken");
let token = "";

module.exports = (request, response,next) => {
   try{
    const {authorization} = request.headers;
    
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        token = authorization.substring(7);
    }


    const decodedToken = jwt.verify(token, process.env.SECRET);

    if(!token || !decodedToken.username){
        return response.status(401).json({ error: 'token missing or invalid'});
    }
    const {username, correo} = decodedToken;

    request.username = username;
    request.correo = correo;
   }catch(error){
       next(error);
   }
    next();
}



// user estractor middleware lo podemos utilizar en todas las rutas que queramos proteger