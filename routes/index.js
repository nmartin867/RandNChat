const express = require('express');
const router = express.Router();
const ChatRepo = require('../repository/ChatRepository').newInstance('../chat.db');

router.get('/', (req, res, next) => {
  if(req.user) {
    ChatRepo.getAll((err, messages) => {
      if(err) return next(err);
      const chatHistory = messages.map(m => ({
        userMessage: req.user.id === m.userid,
        message: m
      }));
      return res.render('index', { chatHistory });
    });
  }
  res.render('index');
});

module.exports = router;
