const path = require('path');
const consolidate = require('consolidate');
const express = require('express');
const port = 80;

let app = express();

app.engine('html', consolidate.mustache);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));

require('./routes/print')(app);
require('./routes/student')(app);
require('./routes/studentFactory')(app);

app.listen(port, () => {
    console.log('Listening on port ' + port);
});

