var passport = require('passport');
var express = require('express');
var githook = require('../procs/githook');
var User = require('../models/user');
var Lecture = require('../models/lecture');
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
        res.render('about', { title: 'About...', message: 'The Challenge Accepted Workshop : ' + req.user.google.datecreated });
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
        res.render('lectures', { title: 'Lecture Notes', user: req.user });
    });
    router.post('/lectures/:id', function (req, res) {
        console.log("BODY:" + JSON.stringify(req.body));
        var inputlect = req.body;
        var lect = new Lecture();
        for (var x in inputlect) {
            if (lect.hasOwnProperty(x)) {
                console.log("had property :" + x);
                lect[x] = inputlect[x];
            }
            else {
                console.log("didn't have property :" + x);
            }
        }
        //req.params.id
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
        successRedirect: '/profile',
        failureRedirect: '/'
    }));
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