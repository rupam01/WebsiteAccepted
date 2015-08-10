import passport = require('passport');
import express = require('express');
import githook = require('../procs/githook');
import User = require('../models/user');
import Lecture = require('../models/lecture');
import Survey = require('../models/survey');

export function routes(app:express.Express) : express.Router{
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
    router.get('/contact', function (req: express.Request, res: express.Response) {
        console.log('contact');
        res.render('contact', { title: 'Contact Information', message: 'Feel free to contact us:' });
    });
    router.get('/login', function (req: express.Request, res: express.Response) {
        console.log('login');
        res.render('login', { title: 'Log In', message: req.flash ? req.flash('loginMessage') : "noflash" });
    });
    router.get('/signup', function (req: express.Request, res: express.Response) {
        console.log('signup');
        res.render('signup', { title: 'Sign Up', message: req.flash ? req.flash('signupMessage') : "noflash" });
    });
    router.get('/profile', function (req, res) {
        console.log('profile');
        res.render('profile', { title: 'Profile', user: req.user });
    });

  var mLectureArg = [
    {
      token: "lecture1",
      lecturenum: 1,
      tagline: "Introduction"
    }
  ];
    router.get('/lectures', function (req, res) {
        console.log('lectures');
        Lecture.find({}, function (err, lectures) {
            if (err) throw err;
            res.render('lectures', { title: 'Lecture Notes', user: req.user, lectureArg: lectures });
        });
    });
    router.get('/surveydump/:lecture_num', function (req, res) {
        var sSurvey: any = Survey;
        sSurvey.getSurveyData(req.params.lecture_num, function (result) {
            res.end(result);
        });
    });
    router.get('/lecture/:lecture_num', function (req, res) {
      Lecture.findOne({ lecture_num: req.params.lecture_num }, function (err, lect) {
        if (err || !lect) res.redirect('/');
        res.render('lecture', { user: req.user, lectureArg: lect });
      });
    });
    router.post('/lectures/:lecture_num', (req, res) => {
        var inputlect = req.body;
        Lecture.findOne({ lecture_num: req.params.lecture_num }, function (err, lect) {
            var msg = 'Updated pre-existing Lecture in DB.';
            if (err || !lect) {
                lect = new Lecture();
                msg = 'Inserted new Lecture in DB.';
            }

            var sch: any = Lecture.schema;
            var paths = sch.paths;

            for (var x in inputlect) {
                if (paths.hasOwnProperty(x)) {
                    lect[x] = inputlect[x];
                    //console.log("had property :" + x);
                }
                //else {
                //    console.log("didn't have property :" + x);
                //}
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

    router.post('/survey', function (req, res) {
        //if (req.params.questions.count !== 6) res.end('Invalid number of questions.');
        var survey = new Survey();
        survey.lecture_num = req.params.lecture_num;
        survey.date = new Date();
        survey.comment = req.params.comment;
        survey.questions = req.params.questions;
        survey.save(function (err) {
            if (err) {
                console.log("ERROR while saving survey to DB: " + err);
                res.end("ERROR while saving survey to DB: " + err);
                throw err;
            }
            console.log("Wrote survey to DB.");
            res.end("Wrote survey to DB.");
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
    User.find({}, (e, u) => res.send(JSON.stringify(u)));
  });

    // process the login form
    router.post('/login', passport.authenticate('local-login', {
            successRedirect: '/profile', // redirect to the secure profile section
            failureRedirect: '/login', // redirect back to the signup page if there is an error
            failureFlash: true // allow flash messages
        })
    );
    
    // process the signup form
    router.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/profile', // redirect to the secure profile section
            failureRedirect: '/signup', // redirect back to the signup page if there is an error
            failureFlash: true // allow flash messages
        })
    );

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
    router.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));



    return router;
};
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}