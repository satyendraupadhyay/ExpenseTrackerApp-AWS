const express = require('express');

const mainPageController = require('../controllers/mainpage');

const router = express.Router();

router.get('/home', mainPageController.getHomepage);
router.get('', mainPageController.getErrorPage);

module.exports = router;