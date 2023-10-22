const express = require('express');
const router = require('./routes/task.routes');

const app = express();
const port = 4000;

app.use(router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
