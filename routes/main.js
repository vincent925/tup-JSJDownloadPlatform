var express = require('express');
var router = express.Router();
var checkLogin = require('../middlewares/check').checkLogin;

router.get('/', function (req, res, next) {
    var code = req.session.code;
    if(code==undefined){
        req.flash('error', '请先登录！');
        res.redirect('/');
    }
    //req.flash('success', '已登录！');
    res.render('main3');
});

module.exports = router;