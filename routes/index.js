var express = require('express');
var router = express.Router();

const companyController = require('../contollers').company

router.get('/api', function(req, res){
  res.send('welcome to api')
})

//router.post('/api/company', companyController.create)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
