const express = require('express');

const router = require('./routes/task.routes');

const app = express();

app.set('port', 4000 || process.env.PORT);

app.use(router);


app.listen(app.get('port'), () => {
  console.log(`Server is running on port ${app.get('port')}`);
});
