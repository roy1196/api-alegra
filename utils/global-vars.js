global.ErrorLogger = require('./error-logger');
global.config = { ...require('../config/config') };
global.createHttpError = require('http-errors');