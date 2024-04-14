const path = require('path');
const expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/database');

exports.getAddExpense = (req, res) => {
    res.sendFile(path.join(__dirname,'..','views','main.html'));
}

exports.postAddExpense = async (req, res, next) => {
    try {
        const t = await sequelize.transaction();
        const { amount, description, category } = req.body;
        try {
            const createdExpense = await expense.create({
                amount: amount,
                description: description,
                category: category,
                userId: req.user.id,
            }, {
                transaction: t
            });
            const totalExpense = Number(req.user.totalExpenses) + Number(amount);
            await User.update({
                totalExpenses: totalExpense
            }, {
                where: { id: req.user.id },
                transaction: t
            });
            await t.commit(); // Commit the transaction if everything is successful
            res.status(201).json({ newExpenseDetail: createdExpense });
        } catch (err) {
            console.error(err);
            await t.rollback(); // Rollback the transaction in case of an error
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    } catch (transactionError) {
        console.error(transactionError);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

exports.getExpense = async (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;
    const limit = parseInt(req.query.limit);

    try {
        // Count total items before fetching the data
        totalItems = await expense.count({ where: { userId: req.user.id } });
        const expenses = await expense.findAll({ 
            where: { 
                userId: req.user.id,
            },
            offset: (page - 1) * limit,
            limit
        });
        res.json({
            expenses: expenses,
            currentPage: page,
            hasNextPage: limit * page < totalItems,
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / limit),
            limit
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteExpense = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const expenseId = req.params.id;
        const userId = req.user.id;
        const expenseItem = await expense.findOne({ where: {id: expenseId, userId: userId}, transaction: t });
        if(!expenseItem){
            res.status(404).json({ msg: 'Item not found' });
            return;
        } 
        const totalExpense = parseInt(req.user.totalExpenses) - parseInt(expenseItem.amount);
        await User.update({totalExpenses: totalExpense}, {where: {id: userId}, transaction: t});
        expenseItem.destroy();
        await t.commit();
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        await t.rollback();
        res.status(500).json({ success: false, error: 'Could not delete expense' });
    }
};
