const Razorpay = require('razorpay');
const order = require('../models/orders');
const userController = require('./user');

const purchasepremium = async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 2500;
        rzp.orders.create({amount, currency: "INR"}, (err, order) => {
            if(err) {
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({orderid: order.id, status:'PENDING'}).then(() => {
                return res.status(201).json({order, key_id: rzp.key_id});
            }).catch(err => {
                throw new Error(err)
            })
        })
    } catch(err) {
        console.log(err);
        res.status(403).json({message: 'Something went wrong', error: err})
    }
}

const updateTransactionStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const { payment_id, order_id } = req.body;
        const foundOrder = await order.findOne({ where: { orderid: order_id } });
        if (!foundOrder) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        const updateOrderPromise = foundOrder.update({ paymentid: payment_id, status: 'SUCCESSFUL' });
        const updateUserPromise = req.user.update({ ispremiumuser: true });
        await Promise.all([updateOrderPromise, updateUserPromise]).then(() => {
            return res.status(202).json({ success: true, message: 'Transaction successful', token: userController.generateAccessToken(userId, undefined, true) });
        }).catch((error) => {
            throw new Error(error);
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = {
    purchasepremium,
    updateTransactionStatus
}