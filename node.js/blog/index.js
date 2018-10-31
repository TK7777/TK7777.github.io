var express = require('express');
var bodyParser = require('body-parser')
//服务器运行链接数据库
var db = require('./lib/mongoose').db
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
var flash = require('connect-flash')
var app = express()

//使用静态托管
app.use(express.static('public'));
//使用模板引擎
app.set('views', './views');
app.set('view engine', 'ejs');
//使用body-parser
app.use(bodyParser.urlencoded({extended: false}));
//使用session
app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000
        },
        store: new MongoStore({
            mongooseConnection: db
        })
    })
);
//使用flash
app.use(flash());
//设置flash每一次响应请求带的参数
app.use((req,res,next)=>{
    res.locals.user = req.session.user
    res.locals.success = req.flash('success').toString()
    res.locals.error = req.flash('error').toString()
    next()
});
//使用路由
app.use('/',require('./routers/indexRouter'));
app.use('/login',require('./routers/loginRouter'));
app.use('/register',require('./routers/registerRouter'));
app.use('/logout',require('./routers/logoutRouter'));
app.use('/posts',require('./routers/postsRouter'));
app.use('/comments',require('./routers/commentsRouter'));

app.listen(8080, () => {
    console.log(`Server started on 8080`);
});