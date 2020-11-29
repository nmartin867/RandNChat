const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const UserRepo = new require('../repository/UserRepository').newInstance('../chat.db');
const _ = require('lodash');

var loginResponse = {title: 'Who is this??', page: 'login'};
var createResponse = {title: 'Who you gonna be?!', page: 'create'};

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


router.get('/login', (req, res) => {
    res.render('user', {title: 'Who is this??', page: 'login'})
});

router.get('/create', (req, res) => {
    res.render('user', {title: 'Who you gonna be?!', page: 'create'})
});


router.post('/create', (req, res) => {
    const {username, password} = req.body;
    UserRepo.createUser(username, password, (err, user) => {
        if (err) {
            req.flash('message', err.message)
            res.render('user', {...createResponse, username, password, error: err});
        } else {
            req.flash('message', 'Saaweet! Now login!');
            res.redirect('/login');
        }
    });
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', function (err, user, info) {
        if (err) return next(err);
        if (!user) {
            req.flash('message', info.message || 'Invalid username or password.');
            return res.redirect('/login');
        }
        req.logIn(user, function(err) {
            if (err) return next(err);
            return res.redirect('/');
        });
    })(req, res, next);
});


module.exports = router;
