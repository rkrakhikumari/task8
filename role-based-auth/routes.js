// routes.js
const express = require('express');
const { verifyToken, authorizeRole } = require('./middleware');

const router = express.Router();

router.get('/admin', verifyToken, authorizeRole(['admin']), (req, res) => {
  res.send('Welcome Admin');
});

router.get('/user', verifyToken, authorizeRole(['user', 'admin']), (req, res) => {
  res.send('Welcome User');
});

module.exports = router;