require('dotenv').config();
const express = require('express');
const router = require('./routes/task.routes');
const loginrouter = require('./controllers/login');

const app = express();
app.use(express.json());
app.use(router);
app.use(loginrouter);


app.listen(process.env.port, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
