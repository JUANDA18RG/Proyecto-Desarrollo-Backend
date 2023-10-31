require('dotenv').config();
const express = require('express');
const router = require('./routes/task.routes');
const loginrouter = require('./controllers/login');

const app = express();
const port = 4000;

app.use(express.json());
app.use(router);
app.use(loginrouter);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
