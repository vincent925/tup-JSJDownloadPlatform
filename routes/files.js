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
        var key='c556f6d6-6872-4a5a-9a0d-3755bfed301c/Setup_MS_4.2.4_Win XP.exe';
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
        var key='e56d7766-3719-4d05-8985-3cd3ac129464/Setup_C_4.2.4 Win XP.exe';
        var privateDownloadUrl = bucketManager.privateDownloadUrl(privateBucketDomain, key, deadline);
        res.redirect(privateDownloadUrl);
    }
});

module.exports = router;