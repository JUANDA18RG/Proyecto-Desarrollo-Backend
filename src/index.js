require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router = require('./routes/task.routes');
const app = express();
const handlerError = require('./handlerError.js');
const cronReserva = require('./cron_functions.js');
const fsql = require('./controllers/task.controllers.js');

app.use(cors({
  origin: 'http://localhost:5173' // solo permite recibir de esta funcion
}));

//  mostrar las imagenes al frontend para que pueda llamarlos
// así <img src="http://localhost:4000/image.jpg" alt="Descripción de la imagen">
app.use(express.static('src/assets'));

//routes

app.set('port', process.env.PORT || 4000);

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173' // solo permite recibir de esta funcion
}));
app.use(router.router);
app.use(router.routerlogin);
app.use('/reserva', router.routerReserva);

app.use(handlerError);

// Ejecutar la función a la 1:00 AM todos los días
cronReserva();

// funcion que se ejecuta al iniciar servidor para pruebas de desarrollo
fsql.updateStates().then(() => {
  console.log('Estados actualizados');
}).catch((error) => {
  console.error('Error al actualizar estados:', error);
});

app.listen(app.get('port'), () => {
  console.log(`Server is running on port ${app.get('port')}`);
});
