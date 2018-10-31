var mongoose = require('mongoose')
var UserSchema = mongoose.Schema({
    username:{
        type:String,
        unique:true
    },
    password:String,
    gender:String,
    profile:String,
    avatar:String
})
exports.User = mongoose.model('User',UserSchema)