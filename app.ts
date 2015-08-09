import http = require('http');
import express = require('express');
import path = require('path');
import favicon = require('serve-favicon');
import logger = require('morgan');
import session = require('express-session');
import passport = require('passport');
import cookieParser = require('cookie-parser');
import flash = require('connect-flash');
import bodyParser = require('body-parser');
import errorHandler = require('errorhandler');
import mongoose = require('mongoose');
import routes = require('./routes/routes');
import configPassport = require('./config/passport');
var app = express();

//is this needed?
//var methodOverride = require('method-override');


//import passport = require('passport-google-oauth');
mongoose.connect('mongodb://localhost:27017');
app.use(cookieParser('imnotexactlysurewhatthisissupposedtobe')); //3
//app.use(bodyParser());
//app.use(bodyParser.json);

//var port = 3000;
var port = 80;

// all environments
app.set('port', ""+port); //process.env.PORT || 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(methodOverride());


import stylus = require('stylus');
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
    app.use(errorHandler());
}

configPassport(passport); // pass passport for configuration

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'imnotexactlysurewhat'
}));
//app.use(multer());
//app.use(express.session({ secret: 'imnotexactlysurewhatthisissupposedtobe' }));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    next();
});

app.use('/', routes.routes(app, passport));

app.get('/slides_lecture1', function (req, res, next) {
    //var file = req.params.file
    var file = 'Lesson1.pptx';
    var path = __dirname + '/files/' + file;
    res.download(path);
});
app.get('/syllabus', function (req, res, next) {
    //var file = req.params.file
    var file = 'syllabus2.pdf';
    var path = __dirname + '/files/' + file;
    res.download(path);
});


// error handling middleware. Because it's
// below our routes, you will be able to
// "intercept" errors, otherwise Connect
// will respond with 500 "Internal Server Error".
//app.use(function (err, req, res, next) {
//    // special-case 404s,
//    // remember you could
//    // render a 404 template here
//    if (404 == err.status) {
//        res.statusCode = 404;
//        res.send('Cant find that file, sorry!');
//    } else {
//        next(err);
//    }
//});

//app.get('/t1', function (req, res) {
//    req.flash('test', 'it worked');
//    res.redirect('/t2');
//});
//app.all('/t2', function (req, res) {
//    var t = req.flash('test');
//    console.log("::" + t);
//    res.send(JSON.stringify(t));
//});
//require('./routes/routes.js')(app, passport);
//routes(app, passport);

var server = http.createServer(app);
server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});




