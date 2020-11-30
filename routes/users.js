const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const UserRepo = new require('../repository/UserRepository').newInstance('../chat.db');
const _ = require('lodash');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    UserRepo.findById(id, done);
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        UserRepo.authenticate(username, password, (err, success, user) => {
            if (err) return done(err);
            if (!success) return done(null, false, {message: 'Invalid username or password'})
            return done(null, user);
        });
    }
));

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/session', (req, res) => {
    res.json({
        authenticated: req.user ? true : false,
        user: req.user
    });
});

router.get('/create', (req, res) => {
   res.render('create', {
       title: 'Create Account',
       user: null
   });
});

router.post('/create', (req, res) => {
    const {username, password} = req.body;
    UserRepo.createUser(username, password, (err, user) => {
        if (err) {
            req.flash('message', err.message)
            res.redirect('/create');
        } else {
            req.flash('message', 'Saaweet! Now login!');
            res.redirect('/');
        }
    });
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', function (err, user, info) {
        if (err) return next(err);
        if (!user) {
            req.flash('message', info.message || 'Invalid username or password.');
            res.redirect('/');
        }
        req.logIn(user, function(err) {
            if (err) return next(err);
            res.redirect('/');
        });
    })(req, res, next);
});


module.exports = router;
