const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/me/:id
router.get('/me/:id', authController.getMe);

module.exports = router;
