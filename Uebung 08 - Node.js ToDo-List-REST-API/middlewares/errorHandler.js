const log4js = require("log4js");
const {validationResult} = require('express-validator');
const {ValidationError} = require('express-json-validator-middleware');

let logger = log4js.getLogger('errorHandler')

baseErrorHandler = function(err, req, res, next) {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err && err.type === 'entity.parse.failed') {
        logger.error('Malformed JSON body:', err.message);
        res.status(400).json({ error: 'Malformed JSON body', details: err.message })
    } else if (err instanceof ValidationError) {
        logger.error('Invalid JSON body')
        res.status(400).json({ error: 'Invalid JSON body', details: err.validationErrors });
    } else {
        logger.error(err);
        res.status(err.status || 500).json({ error: 'Internal Server Error' });
    }

}

validationErrorHandler = function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Bad request', details: errors.array() });
    } else {
        next();
    }
}

module.exports = {
    baseErrorHandler: baseErrorHandler,
    validationErrorHandler: validationErrorHandler
}
