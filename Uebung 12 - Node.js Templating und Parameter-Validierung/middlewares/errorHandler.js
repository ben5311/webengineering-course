const {ValidationError} = require('express-json-validator-middleware');

baseErrorHandler = function(err, req, res, next) {
    console.log(err);
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err && err.type === 'entity.parse.failed') {
        res.status(400).json({ error: 'Malformed JSON body', details: err.message })
    } else if (err instanceof ValidationError) {
        res.status(400).json({ error: 'Invalid JSON body', details: err.validationErrors });
    } else {
        res.status(err.status || 500).json({ error: 'Internal Server Error' });
    }
    next();
}

module.exports = {
    baseErrorHandler: baseErrorHandler
}
