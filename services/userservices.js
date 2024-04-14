const expense = require('../models/expense');

exports.getExpense = (req) => {
    return expense.findAll({ where: { userId: req.user.id } });
}