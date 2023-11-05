require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const router = require('./routes/task.routes');
const loginrouter = require('./controllers/login');


const app = express();

app.use(cors({
  origin: 'http://localhost:5173' // solo permite recibir de esta funcion
}));

//routes

app.use('/user-password', router);


app.set('port', 4000 || process.env.PORT);

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173' // solo permite recibir de esta funcion
}));
app.use(router);
app.use(loginrouter);



app.listen(app.get('port'), () => {
  console.log(`Server is running on port ${app.get('port')}`);
});
