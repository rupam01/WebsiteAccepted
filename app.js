var express = require('express');
var http = require('http');
var path = require('path');
var database = require('./config/database.js');
var passport = require('passport');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
//import passport = require('passport-google-oauth');
app.use(cookieParser());
app.use(bodyParser());
var port = 3000;
// all environments
app.set('port', "" + port); //process.env.PORT || 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
var stylus = require('stylus');
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}
// require('./config/passport')(passport); // pass passport for configuration
app.use(session({ secret: 'imnotexactlysurewhatthisissupposedtobe' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('./routes/routes.js')(app, passport);
var server = http.createServer(app);
server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
//con.query('CALL sp_getall()', function (err, rows) {
//    if (err) throw err;
//    console.log('Data received from Db:\n');
//    console.log(rows);
//});
//con.end(function (err) {
//    //connection end
//    console.log('Connection closed');
//});
//var ii;
//var s1 = { firstname: "tester", lastname: "mcTest", email: "te@s.t" };
//con.query('INSERT INTO students SET ?', s1, function (err, res) {
//    if (err) throw err;
//    console.log('Last ID inserted:', res.insertId);
//    ii = res.insertId;
//    con.query('UPDATE students SET bio = ? WHERE id = ?',
//        ["Testicles. Tried and Tested.", ii - 5],
//        (err, result) => {
//            if (err) throw err;
//            console.log('Changed ', result.changedRows + ' rows');
//            con.query(
//                'DELETE FROM students WHERE id = ?',
//                [5],
//                function (err, result) {
//                    if (err) throw err;
//
//                    console.log('Deleted ' + result.affectedRows + ' rows');
//                    con.end(function (err) {
//                        //connection end
//                        console.log('Connection closed');
//                    });
//                });
//        });
//    
//});
//con.query('SELECT * FROM students', function (err, rows) {
//    if (err) throw err;
//    console.log('Data received from Database:\n');
//    console.log(rows);
//}); 
//# sourceMappingURL=app.js.map