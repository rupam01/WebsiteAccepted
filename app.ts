import express = require('express');
import routes = require('./routes/routes');
import http = require('http');
import path = require('path');

var passport = require('passport');
var flash = require('connect-flash');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var session = require('express-session');
var mongoose = require('mongoose');
var app = express();

//import passport = require('passport-google-oauth');
mongoose.connect('mongodb://localhost:27017');
app.use(cookieParser());
app.use(bodyParser());

var port = 3000;

// all environments
app.set('port', ""+port); //process.env.PORT || 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);

import stylus = require('stylus');
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

require('./config/passport')(passport); // pass passport for configuration

//app.use(session({ secret: 'imnotexactlysurewhatthisissupposedtobe' }));

app.use(express.session({ secret: 'imnotexactlysurewhatthisissupposedtobe' }));

var f = flash();
console.log(f);
//app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(f);

require('./routes/routes.js')(app, passport);


var server = http.createServer(app);

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

