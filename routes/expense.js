const path = require('path');

const express = require('express');

const expenseController = require('../controllers/expense');

const userAuth = require('../middleware/auth')

const router = express.Router();

router.get('/add-expense', expenseController.getAddExpense);
router.post('/add-expense', userAuth.authenticate, expenseController.postAddExpense);

router.get('/get-expense', userAuth.authenticate, expenseController.getExpense);

router.delete('/delete-expense/:id', userAuth.authenticate, expenseController.deleteExpense);

module.exports = router;