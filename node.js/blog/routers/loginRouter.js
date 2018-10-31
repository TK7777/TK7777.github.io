var express = require('express');
var router = express.Router();
var User = require('../models/User').User

router.get('/', (req, res) => {
    res.render('login');
});
router.post('/', (req, res) => {
    var username = req.body.username
    var password = req.body.password
    
    try {
        if (!username) {
            throw new Error('用户名不能为空')
        }
        if (!password) {
            throw new Error('密码不能为空')
        }
    } catch (error) {
        req.flash('error',error.message)
         res.redirect('back');
         return
    }
    
    User.findOne({
        username:username
    },(err,result)=>{
        if (err) {
            console.log('查找用户失败',err)
        }
        if (!result) {
            req.flash('error','用户不存在')
             res.redirect('back');
             return
        }
        if (result.password != password) {
            req.flash('error','密码错误')
             res.redirect('back');
             return
        }else{
            req.session.user = result
            req.flash('success','登陆成功')
             res.redirect('/posts?autor='+result._id);
        }
    })
});

module.exports = router