const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

// User sign up
router.post('/signup', userCtrl.signup);

// User login
router.post('/login', userCtrl.login);

module.exports = router;