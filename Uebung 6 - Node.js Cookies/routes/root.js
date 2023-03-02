module.exports = function (app) {
    app.use('/', (req, res, next) => {
        res.cookie('lastVisit', new Date().toISOString());
        next();
    });
};
