const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const browserify = require('browserify');

router.get('/', (req, res, next) => {
    res.setHeader('content-type', 'application/javascript');
    const input = path.join(__dirname, '../shared', 'mchat-client.js');
    const b = browserify(input).bundle();
    b.on('error', err => {
        return next(err);
    });
    b.pipe(res);
});

module.exports = router;