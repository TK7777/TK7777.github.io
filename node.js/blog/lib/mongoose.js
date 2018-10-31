var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/node-blog',(err)=>{
    if (err) {
        console.log('数据库连接失败')
    } else {
        console.log('数据库连接成功')
    }
})
exports.db = mongoose.connection
