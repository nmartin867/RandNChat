const express = require('express');
const router = express.Router();
const _ = require('lodash');
const ChatRepo = require('../repository/ChatRepository').newInstance('../chat.db');

router.get('/', (req, res, next) => {
  const { id, username } = req.user || {};
  const chatState = {
    title: 'Martin Chat',
    loggedIn: req.user ? true : false,
    user: {
      id,
      username
    }
  }
  if(req.user) {
    ChatRepo.getAll((err, messages) => {
      if(err) return next(err);
      const chatHistory = messages.map(m => ({
        currentUserMessage: m.userId === req.user.id,
        message: m
      }));
      chatState.chatHistory = chatHistory;
    });
  }
  res.render('index', chatState);
});

module.exports = router;
