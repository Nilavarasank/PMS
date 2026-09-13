const express = require('express');
const authViewModel = require('../viewmodels/auth.viewmodel');
const { registerRules, loginRules } = require('../validators/auth.validator');
const { authRateLimiter } = require('../middleware/rateLimiter.middleware');

const router = express.Router();

router.post('/register', authRateLimiter, registerRules, authViewModel.register);
router.post('/login', authRateLimiter, loginRules, authViewModel.login);
router.post('/logout', authViewModel.logout);

module.exports = router;
