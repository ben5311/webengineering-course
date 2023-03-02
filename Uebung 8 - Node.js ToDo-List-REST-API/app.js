const express = require('express');
const log4js = require("log4js");
const cors = require("cors");
const {baseErrorHandler} = require('./middlewares/errorHandler');
const port = 1001;

let app = express();
log4js.configure('./config/log4js.json')
let appLogger = log4js.getLogger('app');
let corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(log4js.connectLogger(log4js.getLogger('http'), {level: 'auto'}));
app.use(cors(corsOptions));
app.use(express.urlencoded({extended: true}));
app.use(express.json())

app.get('/', (req, res) => res.redirect('/todos'));
require('./routes/print')(app)
require('./routes/todos')(app)
app.use(baseErrorHandler);

app.listen(port, () => {
    appLogger.info('Listening on port ' + port);
});

