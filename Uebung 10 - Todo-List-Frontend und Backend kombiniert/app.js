const express = require('express');
const log4js = require('log4js');
const path = require('path');
const {baseErrorHandler} = require('./middlewares/errorHandler');
const port = 80;

let app = express();
log4js.configure('./config/log4js.json');
let appLogger = log4js.getLogger('app');

app.use(log4js.connectLogger(log4js.getLogger('http'), {level: 'auto'}));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

require('./routes/print')(app);
require('./routes/todos')(app);
app.use(baseErrorHandler);

app.listen(port, () => {
    appLogger.info('Listening on port ' + port);
});
