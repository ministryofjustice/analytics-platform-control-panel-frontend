var express = require('express');
var join = require('path').join;

var router = new express.Router();


function home(req, res) {
  res.render('home.html');
}


router.use(express.static(join(__dirname, '../static')));
router.get('/', home);

module.exports = router;
