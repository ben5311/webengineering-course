const path = require('path')
const express = require('express');
const consolidate = require('consolidate');

const {baseErrorHandler} = require('./middlewares/errorHandler')

const port = 80;
const app = express();

app.engine('html', consolidate.mustache);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use('/users', require('./routes/users'))

app.use(express.static(path.join(__dirname, 'public'), {index: 'login.html'}));
app.use(baseErrorHandler);

app.listen(port, () => console.log('listening on port ' + port));
