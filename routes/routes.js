// app/routes.js
module.exports = function (app, passport) {
    app.get('/', function (req, res) {
        res.render('index', { title: 'Challenge Accepted Course Website', year: new Date().getFullYear() });
    });
    app.get('/about', function (req, res) {
        res.render('about', { title: 'About', year: new Date().getFullYear(), message: 'Your application description page' });
    });
    app.get('/contact', function (req, res) {
        res.render('contact', { title: 'Contact', year: new Date().getFullYear(), message: 'Your contact page' });
    });
    app.get('/login', function (req, res) {
        res.render('login', { title: 'Log In', year: new Date().getFullYear(), message: 'Please log in below with Gmail' });
    });
    app.get('/signup', function (req, res) {
        res.render('signup', { title: 'Sign Up', year: new Date().getFullYear(), message: 'Sign up using your Gmail' });
    });
    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function (req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });
    // process the login form
    // app.post('/login', do all our passport stuff here);
    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function (req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });
    // process the signup form
    // app.post('/signup', do all our passport stuff here);
    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile.ejs', {
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