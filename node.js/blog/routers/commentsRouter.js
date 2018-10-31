var express = require('express');
var router = express.Router();
var Comment = require('../models/Comment').Comment
var Post = require('../models/Post').Post
var checkLogin = require('../middleware/checkLogin').checkLogin

//发表留言
router.post('/:postId',checkLogin, (req, res) => {
    var content = req.body.content
    var postId = req.params.postId
    var author = req.session.user._id
    try {
        if (!content) {
            throw new Error('评论内容不能为空')
        }
    } catch (error) {
        req.flash('error',error.message)
         res.redirect('back');
         return
    }
    Comment.create({
        postId:postId,
        content:content,
        author:author
    },(err,result)=>{
        if (err) {
            console.log('发布留言失败',err)
        }
        req.flash('success','留言成功')
        res.redirect('back');
        Post.findById(postId,(err1,result1)=>{
            console.log('aa',result1)
            Post.findByIdAndUpdate(postId,{
                comments:result1.comments+1
            },(err2,result2)=>{})
        })
    })
});
//删除留言
router.get('/:commentId/remove',checkLogin, (req, res) => {
    var commentId = req.params.commentId
    Comment.findById(commentId,(err,result)=>{
        if (err) {
            console.log('查找留言失败',err)
        }
        //判断当前用户是否与留言用户相同
        if (result.author==req.session.user._id) {
            Comment.findByIdAndRemove(commentId,(err1,result1)=>{
                req.flash('success','删除留言成功')
                 res.redirect('back');

                 Post.findById(result1.postId,(err2,result2)=>{
                     Post.findByIdAndUpdate(result1.postId,{
                         comments:result2.comments-1
                     },()=>{})
                 })
            })
        }
    })
});

module.exports = router