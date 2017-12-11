var express = require('express');
var router = express.Router();
var checkLogin = require('../middlewares/check').checkLogin;
var qiniu = require('qiniu');
var accessKey = 'FQy_HVQpTeQPGc4riZqm0WBglJzwE2G2G5OJ5qf6';
var secretKey = '4KsDbGPJjP8zAfapyMPav-mUdPUR8PkP-SqA1i0C';

router.get('/:type', function (req, res, next) {
    var code = req.session.code;
    if(code==undefined){
        req.flash('error', '请先登录！');
        res.redirect('/');
    }
    var type = req.params.type;
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    var config = new qiniu.conf.Config();
    var bucketManager = new qiniu.rs.BucketManager(mac, config);
    var privateBucketDomain = 'http://cms2.izhixue.cn';
    var deadline = parseInt(Date.now() / 1000) + 600; // 10分钟过期
    
    if(type=='msxp'){
        var key='ab812307-e8bc-4a58-89be-fb115b5e616a/Setup_MS_4.2.4_含安装视频_Win XP.zip';
        var privateDownloadUrl = bucketManager.privateDownloadUrl(privateBucketDomain, key, deadline);
        res.redirect(privateDownloadUrl);
    }
    else if(type=='mswin'){
        var key='43508f3f-5223-4443-92f2-46178ffebd6b/Setup_MS_4.2.4_含安装视频_Win 7以上.zip';
        var privateDownloadUrl = bucketManager.privateDownloadUrl(privateBucketDomain, key, deadline);
        res.redirect(privateDownloadUrl);
    }
    else if(type=='cwin'){
        var key='c4c4de7b-906a-4aae-959d-bc9771b87b6e/Setup_C_4.2.4_含安装视频_Win 7以上.zip';
        var privateDownloadUrl = bucketManager.privateDownloadUrl(privateBucketDomain, key, deadline);
        res.redirect(privateDownloadUrl);
    }
    else{
        var key='be6daca5-3c6a-4431-bb07-1b3aada96a16/Setup_C_4.2.4_含安装视频_Win XP.zip';
        var privateDownloadUrl = bucketManager.privateDownloadUrl(privateBucketDomain, key, deadline);
        res.redirect(privateDownloadUrl);
    }
});

module.exports = router;