const express = require('express');
const api = require('./src/api');

const app = express();

app.use('/api', api);

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});



