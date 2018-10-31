var express = require('express');
var url = require('url')
var router = express.Router();
var Post = require('../models/Post').Post
var Comment = require('../models/Comment').Comment
var checkLogin = require('../middleware/checkLogin').checkLogin

//列出文章
router.get('/', (req, res) => {
    var author = url.parse(req.url,true).query.author
    var whereStr
    if (!author) {
        //列出所有
        whereStr = {}
    }else{
        //列出某一个作者
        whereStr = {
            author:author
        }
    }
    Post.find(whereStr).sort({
        //按最新发布时间排序
        _id:-1
    }).populate('author').exec((err,result)=>{
        if (err) {
            console.log('获取作者文章失败',err)
        }
        res.render('post-list',{
            posts:result
        });
    })
});


//发表文章
router.get('/create',checkLogin, (req, res) => {
    res.render('create')
});
router.post('/create', (req, res) => {
    var title = req.body.title
    var content = req.body.content
    var author = req.session.user._id
    //校验参数
    try {
        if (!title) {
            throw new Error('标题不能为空')
        }
        if (!content) {
            throw new Error('内容不能为空')
        }
    } catch (error) {
        req.flash('error',error.message)
         res.redirect('back');
         return
    }
    //写入数据库
    Post.create({
        title:title,
        content:content,
        author:author
    },(err,result)=>{
        if (err) {
            console.log('发布文章失败','err')
        }
        req.flash('success','发布文章成功')
        res.redirect('/posts/'+result._id);
    })
});
//文章详情页
router.get('/:postId', (req, res) => {
    var postId = req.params.postId
    Post.findById(postId).populate('author').exec((err,result)=>{
        // console.log('result',result)
        if (err) {
            console.log('查找文章失败',err)
        }
        //更新pv
        Post.findByIdAndUpdate(postId,{
            pv:result.pv+1
        },(err1,result1)=>{})
        //查找评论
        Comment.find({
            postId:postId
        }).populate('author').exec((err2,result2)=>{
            res.render('post-detail',{
                post:result,
                comments:result2
            });
        })
    })
});
//删除文章
router.get('/:postId/remove', (req, res) => {
    var postId = req.params.postId
    Post.findById(postId,(err,result)=>{
        if (err) {
            console.log('查找文章失败',err)
        }
        if (result.author==req.session.user._id) {
            Post.findByIdAndRemove(postId,(err1,result1)=>{
                req.flash('success','删除文章成功')
                 res.redirect('/posts');
            })
        }else{
            req.flash('error','没有权限删除文章')
             res.redirect('back');
        }
    })
});
//编辑文章
router.get('/:postId/edit',checkLogin, (req, res) => {
    var postId = req.params.postId
    //判断当前用户是否与文章用户相同
    Post.findById(postId,(err,result)=>{
        if (result.author==req.session.user._id) {
            res.render('edit',{
                post:result
            });
        }else{
            req.flash('error','没权限')
             res.redirect('back');
        }
    })
});

router.post('/:postId/edit',checkLogin,(req, res) => {
    var postId = req.params.postId
    var title = req.body.title
    var content = req.body.content
    // 校验参数
    try {
        if (!title) {
            throw new Error('标题不能为空')
        }
        if (!content) {
            throw new Error('内容不能为空')
        }
    } catch (e) {
        req.flash("error", e.message);
        res.redirect('back');
        // 阻止代码继续向下执行 校验错误就不要写入数据库
        return
    }
    Post.findById(postId,(err,result)=>{
        if (result.author==req.session.user._id) {
            Post.findByIdAndUpdate(postId,{
                title:title,
                content:content
            },(err1,result1)=>{
                if (err1) {
                    console.log('更新文章失败',err1)
                }
                req.flash('success','更新文章成功')
                 res.redirect('/posts/'+result1._id);
            })
        }else{
            req.flash('error','没权限')
             res.redirect('bakc');
        }
    })
});

module.exports = router