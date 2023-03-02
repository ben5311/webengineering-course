module.exports = function (app) {
    app.get('/print', (req, res, next) => {
        res.send(req.query);
        next();
    });
    app.post('/print', (req, res, next) => {
       res.send(req.body);
       next();
    });
};
