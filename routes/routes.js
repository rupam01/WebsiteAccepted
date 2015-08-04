var session = require('express-session');
// app/routes.js
module.exports = function (app, passport) {
    app.get('/', function (req, res) {
        res.render('index', { title: 'Challenge Accepted Course Website' });
    });
    app.get('/about', function (req, res) {
        res.render('about', { title: 'About', message: 'Your application description page' });
    });
    app.get('/contact', function (req, res) {
        res.render('contact', { title: 'Contact', message: 'Your contact page' });
    });
    app.get('/login', function (req, res) {
        res.render('login', { title: 'Log In', message: req.flash ? req.flash('signupMessage') : "noflash" });
    });
    app.get('/signup', function (req, res) {
        res.render('signup', { title: 'Sign Up', message: req.flash ? req.flash('signupMessage') : "noflash" });
    });
    // process the login form
    app.post('/login', function () {
        console.log("PRINTOUT: login post.");
        return passport.authenticate('local-login', {
            successRedirect: '/profile',
            failureRedirect: '/login',
            failureFlash: true // allow flash messages
        });
    }());
    // process the signup form
    app.post('/signup', function () {
        console.log("PRINTOUT: signup post.");
        return passport.authenticate('local-signup', {
            successRedirect: '/profile',
            failureRedirect: '/signup',
            failureFlash: true // allow flash messages
        });
    }());
    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile', {
            user: req.user // get the user out of session and pass to template
        });
    });
    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
};
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
}
//# sourceMappingURL=routes.js.map