const path = require('path');

const express = require('express');

const premiumController = require('../controllers/premiumFeature');

const authMiddleware = require('../middleware/auth')

const router = express.Router();

router.get('/showleaderboard', premiumController.getUserLeaderBoard);

router.get('/download', authMiddleware.authenticate, premiumController.downloadexpense);

router.get('/files', authMiddleware.authenticate, premiumController.getFiles);

module.exports = router;