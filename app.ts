import express = require('express');
import routes = require('./routes/index');
import http = require('http');
import path = require('path');
import mysql = require('mysql');
//import passport = require('passport-google-oauth');

var app = express();

// all environments
app.set('port', "3000"); //process.env.PORT || 
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

app.get('/', routes.index);
app.get('/about', routes.about);
app.get('/contact', routes.contact);
app.get('/syllabus', routes.syllabus);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

var con = mysql.createConnection({
    host: "localhost",
    port: 3001,
    database: "learntocode",
    user: "orbit",
    password: "itsajoke"
});

con.connect(function (err) {
    if (err) {
        console.log('Error connection to Db:' + err);
        return;
    }
    console.log('Connection established');
});

con.query('CALL sp_getall()', function (err, rows) {
    if (err) throw err;
    console.log('Data received from Db:\n');
    console.log(rows);
});
con.end(function (err) {
    //connection end
    console.log('Connection closed');
});

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

