const express = require('express');

const resetpasswordController = require('../controllers/resetpassword');

const router = express.Router();

router.get('/forgotpassword', resetpasswordController.getForgotPassword);
router.post('/forgotpassword', resetpasswordController.postForgotPassword);

router.get('/reset-password/:id', resetpasswordController.getResetPassword);
router.post('/reset-password', resetpasswordController.postResetPassword);

module.exports = router;