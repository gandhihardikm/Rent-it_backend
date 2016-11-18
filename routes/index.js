var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Place Finder App' });
});

router.get('/persons/:id', function(req, res, next) {
  res.render('index', { id: 'Place Finder App' });
});

module.exports = router;
