const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const { token } = require("morgan");

module.exports = (request, response,next) => {
    const { authorization } = request.headers;
    console.log(authorization);
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        token = authorization.substring(7);
    }

    const decodedToken = jwt.verify(token, process.env.SECRET);

    if(!token || !decodedToken.username){
        return response.status(401).json({ error: 'token missing or invalid'});
    }
    const {username} = decodedToken;
    request.username = username;

    next();
}



// user estractor middleware lo podemos utilizar en todas las rutas que queramos proteger