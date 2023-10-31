require('dotenv').config();
const express = require('express');

const router = require('./routes/task.routes');
const loginrouter = require('./controllers/login');

const app = express();

app.set('port', 4000 || process.env.PORT);

app.use(express.json());
app.use(router);
app.use(loginrouter);



app.listen(app.get('port'), () => {
  console.log(`Server is running on port ${app.get('port')}`);
});
