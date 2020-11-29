const express = require('express');
const router = express.Router();
const ChatRepo = require('../repository/ChatRepository').newInstance('../chat.db');

router.ws('/', (ws, req) => {
    ws.on('message', function(msg) {
        ws.send(msg);
    });
});

router.ws('/send', function(ws, req) {
    ws.on('message', function(msg) {
        ws.send(msg);
    });
});

module.exports = router;