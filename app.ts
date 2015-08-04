import http = require('http');
import express = require('express');
var routes = require('./routes/routes');
import path = require('path');

var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');

var passport = require('passport');


var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
//var multer = require('multer');
var errorHandler = require('errorhandler');
var mongoose = require('mongoose');
var app = express();

//import passport = require('passport-google-oauth');
mongoose.connect('mongodb://localhost:27017');
app.use(cookieParser('imnotexactlysurewhatthisissupposedtobe')); //3
//app.use(bodyParser());
//app.use(bodyParser.json);

var port = 3000;

// all environments
app.set('port', ""+port); //process.env.PORT || 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());


import stylus = require('stylus');
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));



//app.get('/about', function (req, res) {
//    console.log('about');
//    res.render('about', { title: 'About', message: 'Your application description page' });
//});

// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

require('./config/passport')(passport); // pass passport for configuration

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

app.use('/', routes(app, passport));



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




