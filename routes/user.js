const path = require('path');

const express = require('express');

const userController = require('../controllers/user');

const authMiddleware = require('../middleware/auth');

const expenseController = require('../controllers/expense');

const router = express.Router();

router.post('/signup', userController.postSignup);
router.get('/signup', userController.getSignup);

router.post('/signin', userController.postSignin);
router.get('/signin', userController.getSignin);

module.exports = router;