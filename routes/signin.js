var sha1 = require('sha1');
var express = require('express');
var router = express.Router();
var base64 = require('base64-utf8');
var request = require('request');
var UserModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signin 登录页
router.get('/', checkNotLogin, function (req, res, next) {
    res.render('signin');
});

// POST /signin 用户登录
router.post('/', function (req, res, next) {
    var name = req.body.name;
    var password = req.body.password;
    password = sha1(password);
    var timestamp = Math.round(new Date().getTime() / 1000);
    var encodeString = base64.encode('j1sOOPEHPd0OQkZj' + timestamp);
    request('http://ucenter.izhixue.cn:666/token/create?userId=59e6b4bbbce05a21f21caf6c&sign=' + encodeString, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var token_json = JSON.parse(body);
            if (token_json.code == 0) {
                var token = token_json.token;

                var requestData = {
                    email: name,
                    password: password
                }
                request({
                    url: 'http://ucenter.izhixue.cn:666/sessions/create?token=' + token,
                    method: "POST",
                    json: true,
                    headers: {
                        "content-type": "application/json",
                    },
                    body: requestData
                }, function (error, response, user_json) {
                    if (!error && response.statusCode == 200) {
                        //var user_json = JSON.parse(body);
                        if (user_json.code == 0) {
                            UserModel.getUserByName(name)
                                .then(function (user) {
                                    if (!user) {
                                        req.flash('error', '用户不存在');
                                        return res.redirect('back');
                                    }
                                    // 检查密码是否匹配
                                    if (password !== user.password) {
                                        req.flash('error', '用户名或密码错误');
                                        return res.redirect('back');
                                    }
                                    req.flash('success', '登录成功');
                                    // 用户信息写入 session
                                    delete user.password;
                                    req.session.user = user;
                                    // 跳转到主页
                                    res.redirect('/main/index2');
                                })
                                .catch(next);
                        }
                        else {
                            if (user_json.code == 10003) { req.flash('error', '用户不存在'); }
                            else { req.flash('error', '用户名或密码错误'); }
                            return res.redirect('back');
                        }
                    }
                });

            }
            else {
                return res.json({ message: 'Token Server Error' });
            }
        }
    });


});

module.exports = router;