var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/check').checkLogin;


router.get('/', function (req, res, next) {
    res.render('main');
});

router.get('/index', function (req, res, next) {
    res.render('main2');
});

router.get('/index2',checkLogin, function (req, res, next) {
    res.render('main3');
});



module.exports = router;