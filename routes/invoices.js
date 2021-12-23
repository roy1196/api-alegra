var express = require('express');
var router = express.Router();

//modules
const CreateInvoinceController = require('../controllers/invoices/create-invoice-controller');

/* GET users listing. */
router.get('/ping', function(req, res, next) {
  res.send('pong');
});

router.post('/', function(req, res, next){
    new CreateInvoinceController({ ...req.body, ...req.params }).save(res);
})

module.exports = router;