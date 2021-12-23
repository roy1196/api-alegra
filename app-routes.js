//Dependencies
const express = require('express');
const router = express.Router({ mergeParams: true });

//Routes
const users = require('./routes/users');
const invoices = require('./routes/invoices');

router.use('/users', users);
router.use('/invoices', invoices);

router.use(function (req, res, next) {
    next(global.createHttpError(404));
});

module.exports = router;