const express = require('express');
const dashboardViewModel = require('../viewmodels/dashboard.viewmodel');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', authMiddleware, dashboardViewModel.getSummary);

module.exports = router;
