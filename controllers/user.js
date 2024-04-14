const path = require('path');

const users = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function generateAccessToken(id, name, ispremiumuser) {
    return jwt.sign({userId: id , name: name, ispremiumuser} , 'secretkey');
}

exports.getSignup = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'signup.html'));
};

exports.postSignup = (req, res, next) => {
    const { name, email, password } = req.body;
    console.log(req.body);
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
        console.log(err);
        const data = await users.create({name: name, email: email, password: hash });
        res.status(201).json({success: true ,newSmDetail: data});
    })
}

exports.getSignin = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'signin.html'));
};

exports.postSignin = async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password){
        res.status(400).json({ msg: 'All fields are required' });
        return;
    }

    try {
        const user = await users.findOne({ where: { email: email } });
        if(!user){
            res.status(404).json({ msg: 'Email not registered' });
            return;
        }
            const hash = user.password;
            const match = await bcrypt.compare(password, hash);
            if (match) {
                res.status(200).json({ success: true, message: "User logged in successfully" , token: generateAccessToken(user.id, user.name, user.ispremiumuser)});
                return;
            } else {
                res.status(400).json({ success: false, message: "Password is incorrect" });
            }
    } catch(err){
        console.log('POST USER LOGIN ERROR');
        res.status(500).json({ error: err, msg: 'Could not fetch user' });
    }
};

module.exports.generateAccessToken = generateAccessToken;