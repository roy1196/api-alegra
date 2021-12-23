require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
require('./utils/global-vars');

const appRoutes = require('./app-routes');
const errorHandler = require('./middlewares/error-handler');


var app = express();

app.use(cors(global.config.cors));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', appRoutes);
app.use('/api', errorHandler);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(global.createHttpError(404));
});

app.use(errorHandler);

module.exports = app;
