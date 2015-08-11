var passport = require('passport');
var express = require('express');
var githook = require('../procs/githook');
var User = require('../models/user');
var Lecture = require('../models/lecture');
var Survey = require('../models/survey');
var mongoose = require('mongoose');
var _ = require('underscore');
var dupe = require('../config/duplicate_scrub');
function routes(app) {
    var router = express.Router();
    router.get('/', function (req, res) {
        //req.flash('info', 'Flash is back!');
        //console.log(req.flash('info'));
        console.log('home');
        res.render('index', { title: 'Challenge Accepted Workshop Website' });
    });
    router.get('/about', function (req, res) {
        console.log('about');
        res.render('about', { title: 'About...', message: 'The Challenge Accepted Workshop' });
    });
    router.get('/contact', function (req, res) {
        console.log('contact');
        res.render('contact', { title: 'Contact Information', message: 'Feel free to contact us:' });
    });
    router.get('/login', function (req, res) {
        console.log('login');
        res.render('login', { title: 'Log In', message: req.flash ? req.flash('loginMessage') : "noflash" });
    });
    router.get('/signup', function (req, res) {
        console.log('signup');
        res.render('signup', { title: 'Sign Up', message: req.flash ? req.flash('signupMessage') : "noflash" });
    });
    router.get('/profile', function (req, res) {
        console.log('profile');
        res.render('profile', { title: 'Profile', user: req.user });
    });
    router.get('/lectures', function (req, res) {
        console.log('lectures');
        Lecture.find({}, function (err, lectures) {
            if (err)
                throw err;
            res.render('lectures', { title: 'Lecture Notes', user: req.user, lectureArg: lectures });
        });
    });
    router.get('/surveydump/:lecture_num', function (req, res) {
        console.log("surveydump received.");
        Survey.getSurveyData(req.params.lecture_num, function (result) {
            console.log("surveydump ending:\n" + result);
            res.end(result);
        });
    });
    router.get('/lecture/:lecture_num', function (req, res) {
        Lecture.findOne({ lecture_num: req.params.lecture_num }, function (err, lect) {
            if (err || !lect)
                res.redirect('/');
            res.render('lecture', { user: req.user, lectureArg: lect });
        });
    });
    router.post('/lectures/:lecture_num', function (req, res) {
        var inputlect = req.body;
        Lecture.findOne({ lecture_num: req.params.lecture_num }, function (err, lect) {
            var msg = 'Updated pre-existing Lecture in DB.';
            if (err || !lect) {
                lect = new Lecture();
                msg = 'Inserted new Lecture in DB.';
            }
            var sch = Lecture.schema;
            var paths = sch.paths;
            for (var x in inputlect) {
                if (paths.hasOwnProperty(x)) {
                    lect[x] = inputlect[x];
                }
            }
            lect.lecture_num = req.params.lecture_num;
            lect.save(function (err) {
                if (err) {
                    console.log("ERROR writing to DB: " + err);
                    throw err;
                }
                console.log(msg);
            });
            res.status(200);
            res.end();
        });
    });
    router.get('/survey/:lecture_num', isLoggedIn, function (req, res) { return res.render('survey.jade', { lecture_num: req.params.lecture_num }); });
    router.post('/survey/:lecture_num', isLoggedIn, function (req, res) {
        if (!req.user || req.user.hasCompletedSurvey(req.params.lecture_num)) {
            console.log("NUH UH: user has already submitted survey");
            res.redirect('/');
            return;
        }
        //if (req.params.questions.count !== 6) res.end('Invalid number of questions.');
        var sentSurvey = req.body;
        var survey = new Survey.model();
        survey.lecture_num = sentSurvey.lecture_num;
        survey.date = new Date();
        survey.comment = sentSurvey.comment;
        survey.questions = sentSurvey.questions;
        survey.save(function (err) {
            if (err) {
                console.log("ERROR while saving survey to DB: " + err);
                res.end("ERROR while saving survey to DB: " + err);
                throw err;
            }
            console.log("Wrote survey to DB.");
            req.user.completeSurvey(sentSurvey.lecture_num);
            req.user.save(function (err) {
                if (err) {
                    console.log("Error while saving user survey completed: " + err);
                }
                console.log("Sucessfully wrote user survey completed to DB.");
            }).exec();
            res.redirect('/lecture/' + survey.lecture_num);
            //res.end("Wrote survey to DB.");
        });
    });
    // =====================================
    // LOGOUT ==============================
    // =====================================
    router.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
    router.post('/githook', githook.processHook);
    router.get('/userdump', function (req, res) {
        User.find({}, function (e, u) { return res.send(JSON.stringify(u)); });
    });
    // process the login form
    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true // allow flash messages
    }));
    // process the signup form
    router.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true // allow flash messages
    }));
    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    router.get('/profile', isLoggedIn, function (req, res) {
        //console.log("user:" + req.user);
        res.render('profile', {
            user: req.user // get the user out of session and pass to template
        });
    });
    // =====================================
    // LOGOUT ==============================
    // =====================================
    router.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    // the callback after google has authenticated the user
    router.get('/auth/google/callback', passport.authenticate('google', {
        //successRedirect: '/profile',
        successRedirect: '/lectures',
        failureRedirect: '/'
    }));
    router.get('/scrub', dupe);
    return router;
}
exports.routes = routes;
;
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
}
//# sourceMappingURL=routes.js.map