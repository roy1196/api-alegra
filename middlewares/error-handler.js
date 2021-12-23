//Models
const errorCodes = require('../config/error-messages.json');

// eslint-disable-next-line no-unused-vars
module.exports = function (err, req, res, next) {
    try {
        const message = errorCodes[err.statusCode || '500']
        global.ErrorLogger.newError(err);
        res.status(err.status || 500);
        res.send({
            'results': 'error',
            'message': message,
            'message_code': err.status
        });
    } catch (e) {
        global.ErrorLogger.newError(e);
    }
}