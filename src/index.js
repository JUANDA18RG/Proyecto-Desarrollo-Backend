require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userExtractor = require('./routes/userExtractor');
const router = require('./routes/task.routes');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173' // solo permite recibir de esta funcion
}));


app.set('port', 4000 || process.env.PORT);

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173' // solo permite recibir de esta funcion
}));
app.use(router.router);
app.use(router.routerlogin);



app.listen(app.get('port'), () => {
  console.log(`Server is running on port ${app.get('port')}`);
});
