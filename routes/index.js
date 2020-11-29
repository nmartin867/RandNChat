const express = require('express');
const router = express.Router();
const _ = require('lodash');
const ChatRepo = require('../repository/ChatRepository').newInstance('../chat.db');

router.get('/', (req, res, next) => {
  if(_.isNil(req.user) || _.isUndefined(req.user)) return res.redirect('/users/login');
  ChatRepo.getAll((err, messages) => {
    if(err) return next(err);
    const chatHistory = messages.map(m => ({
      currentUserMessage: m.userId === req.user.id,
      message: m
    }));
    res.render('index', {
      title: 'Stinky Chat',
      user: req.user,
      history: chatHistory
    });
  });
});

module.exports = router;
