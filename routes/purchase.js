const path = require('path');

const express = require('express');

const purchaseController = require('../controllers/purchase');

const authMiddleware = require('../middleware/auth')

const router = express.Router();

router.get('/premiummembership', authMiddleware.authenticate, purchaseController.purchasepremium);

router.post('/updatetransactionstatus', authMiddleware.authenticate, purchaseController.updateTransactionStatus);

module.exports = router;