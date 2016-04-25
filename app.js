var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');

var passport = require('passport');
var flash = require('connect-flash');
//var morgan = require('morgan');
var session = require('express-session');

try {
    var db = mongoose.connect('mongodb://localhost:27017/garage');
}
catch (err) {
    console.log(err);
}
//require('./config/passport')(passport); // pass passport for configuration


var routes = require('./routes/index')(passport);
var users = require('./routes/users');
var posts = require('./routes/posts');
//var comments = require('./routes/comments');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.jpg'); //Appending .jpg
    }
});

app.use(logger('dev'));
app.use(multer({storage: storage}).any());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(session({secret: '96319fbf7eda501ff8072af0090ab3e0437e977c',
    'saveUninitialized': true,
    'resave': true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./passport/login')(passport);

//app.use(function (req, res, next) {
//    res.header('Access-Control-Allow-Credentials', 'true');
//    res.header("Access-Control-Allow-Origin","*" ); //req.header('Origin')
//    res.header("Access-Control-Allow-Headers",
//        "x-request-with, Content-Type, origin, authorization, accept, client-security-token");
//    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//
//    next();
//});

//require('./routes/users.js')(app, passport);

app.use('/', routes);
app.use('/', users);
app.use('/', posts);
//app.use('/', comments);
//
//
//app.all('*', function (req, res, next) {
//    if (req.params === '/' || req.params === '/login')
//        next();
//    else if (
//        req.isAuthenticated()) {
//        return next();
//    }
//    res.redirect('/login')
//});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
