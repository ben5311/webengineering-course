const path = require('path');
const express = require('express');
const consolidate = require('consolidate');
const session = require('express-session');
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const sequelize = require('./modules/sequelize');
const {extendDefaultFields} = require('./modules/models/session')
const {baseErrorHandler} = require('./middlewares/errorHandler');

const port = 80;
const app = express();
const sessionStore = new SequelizeStore({
    db: sequelize,
    table: "Session",
    extendDefaultFields: extendDefaultFields
});


app.engine('html', consolidate.mustache);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(session({
    secret: "change_it",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: 24*60*60*1000   // 24h
    }
}));

app.get('/', (req, res) => res.redirect('/users/'));
app.use('/users', require('./routes/users'));

app.use(express.static(path.join(__dirname, 'public'), {index: 'index.html'}));
app.use(baseErrorHandler);

sequelize.sync()
    .then(() => app.listen(port, () => console.log('listening on port ' + port)));

