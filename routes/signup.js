var fs = require('fs');
var path = require('path');
var sha1 = require('sha1');
var express = require('express');
var router = express.Router();
var request = require('request');
var base64 = require('base64-utf8');

var UserModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signup 注册页
router.get('/', checkNotLogin, function (req, res, next) {
    res.render('signup');
});

// POST /signup 用户注册
router.post('/', checkNotLogin, function (req, res, next) {
    var name = req.body.name;
    var password = req.body.password;
    var repassword = req.body.repassword;
    var ip = getClientIp(req);
    // 校验参数
    try {
        if (!(name.length >= 1 && name.length <= 100)) {
            throw new Error('名字请限制在 1-100 个字符');
        }
        if (password.length < 6) {
            throw new Error('密码至少 6 个字符');
        }
        if (password !== repassword) {
            throw new Error('两次输入密码不一致');
        }
    } catch (e) {
        req.flash('error', e.message);
        return res.redirect('/signup');
    }
    var timestamp = Math.round(new Date().getTime() / 1000);
    var encodeString = base64.encode('j1sOOPEHPd0OQkZj' + timestamp);
    request('http://ucenter.izhixue.cn:666/token/create?userId=59e6b4bbbce05a21f21caf6c&sign=' + encodeString, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var token_json = JSON.parse(body);
            if (token_json.code == 0) {
                var token = token_json.token;

                // 明文密码加密
                password = sha1(password);

                // 待写入数据库的用户信息
                var user = {
                    name: name,
                    password: password
                };
                var requestData = {
                    name: name,
                    email: name,
                    password: password,
                    type: 'none',
                    site: 'dk.izhixue.cn',
                    ip: ip
                }
                request({
                    url: 'http://ucenter.izhixue.cn:666/users/create?token=' + token,
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
                            user.ssoId=user_json.userId;
                            // 用户信息写入数据库
                            UserModel.create(user)
                                .then(function (result) {
                                    // 此 user 是插入 mongodb 后的值，包含 _id
                                    user = result.ops[0];
                                    // 将用户信息存入 session
                                    delete user.password;
                                    req.session.user = user;
                                    // 写入 flash
                                    req.flash('success', '注册成功');
                                    // 跳转到首页
                                    res.redirect('/main');
                                })
                                .catch(function (e) {
                                    // 用户名被占用则跳回注册页，而不是错误页
                                    if (e.message.match('E11000 duplicate key')) {
                                        req.flash('error', '用户名已被占用');
                                        return res.redirect('/signup');
                                    }
                                    next(e);
                                });
                        }
                        else {
                            return res.json({ message: user_json.message });
                        }
                    }
                });

            }
            else {
                return res.json({ message: 'Token Server Error' });
            }

        }
        else {
            return res.json({ message: 'Error' });
        }
    })


});

function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
};
module.exports = router;