const User = require('../models/user');
const expense = require('../models/expense');
const S3Services = require('../services/s3services');
const Files = require('../models/files');

exports.getUserLeaderBoard = async (req, res) => {
    try {
        const expenses = await User.findAll({
            order: [['totalExpenses', 'DESC']]
        });

        console.log(expenses);
        res.status(200).json(expenses);

    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

exports.downloadexpense = async (req, res) => {
    try {
        const expenses = await expense.findAll({ where: { userId: req.user.id } });
        const stringifiedExpenses = JSON.stringify(expenses);
        const userId = req.user.id
        const filename = `Expense${userId}/${new Date()}.txt`;
        const fileURL = await S3Services.uploadToS3(stringifiedExpenses, filename);
        const files = await Files.create({
            fileURL,
            userId
        })
        res.status(200).json({ fileURL,showFiles: files ,success: true })
    } catch (err) {
        console.log(err);
        res.status(500).json({fileURL: '', success: false, err: err})
    }
}

exports.getFiles = async (req, res) => {
    try {
        const files = await Files.findAll({ where: { userId: req.user.id } });
        res.json(files);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
