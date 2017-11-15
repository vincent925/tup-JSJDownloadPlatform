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
        var key='8621a932-5abb-4f29-bed4-fb02d0c7c8a8/Setup_MS_4.2.3_xp.exe';
        var privateDownloadUrl = bucketManager.privateDownloadUrl(privateBucketDomain, key, deadline);
        res.redirect(privateDownloadUrl);
    }
    else if(type=='mswin'){
        var key='477d52f8-3894-4bea-929d-82e604aa98fd/Setup_MS_4.2.4_win.exe';
        var privateDownloadUrl = bucketManager.privateDownloadUrl(privateBucketDomain, key, deadline);
        res.redirect(privateDownloadUrl);
    }
    else if(type=='cwin'){
        var key='a410c8cf-dc62-4c6d-96b2-139b49783a77/Setup_C_4.2.4 Win 7以上.exe';
        var privateDownloadUrl = bucketManager.privateDownloadUrl(privateBucketDomain, key, deadline);
        res.redirect(privateDownloadUrl);
    }
    else{
        var key='a9049b7b-dc77-497b-bfb5-263ba100af3e/Setup_C_4.2.2_xp.exe';
        var privateDownloadUrl = bucketManager.privateDownloadUrl(privateBucketDomain, key, deadline);
        res.redirect(privateDownloadUrl);
    }
});

module.exports = router;