// core modules
const path = require('path');
// third party modules
const express = require('express');

const port = 80;
const app = express();

app.use('/', express.static(path.join(__dirname, 'public')));

app.listen(port, () => console.log('ToDo list client listening on port ' + port));
