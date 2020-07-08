const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const FormData = require('form-data')
const jsonwebtoken = require('jsonwebtoken');
const transport = require('../common/email');
const User = require('../models/User');
const {PASSWORD_SECRET, JWT_SECRET} = require('../environments');
const multer = require('multer');
const storage = require('../common/storage');

const sendWelcomeEmail = async ({_id, name, email}) => {
    await transport.sendMail({
        from: '"Admin Application" <Admin@admin.com>',
        to: email,
        subject: `Hello Welcome to My Application`,
        html: `<b>Hello ${name}</b><br /><p>Your registration to our app is successful and your id is ${_id}`
    });
}

const registerUser = async (req, res) => {
    req.body = JSON.parse(new FormData(req.body).data);
    const password = crypto.createHmac("sha256", PASSWORD_SECRET).update(req.body.password).digest('hex');
    try {
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password,
            image: req.files,
            role: req.body.role
        }).then( user => {
            res.status(200).send({userId: user._id});
            sendWelcomeEmail(user).then(() => {
                console.log(`Welcome email sent for user with id ${user._id}`);
            });
        });
    } catch (error) {
        res.status(500).send(error);
    }
}

const loginUser = async (req, res) => {
    try {
        User.findOne({email: req.body.email}).then(user => {
            if(user) {
                const password = crypto.createHmac("sha256", PASSWORD_SECRET).update(req.body.password).digest('hex');
                if(user.password === password) {
                    const token = jsonwebtoken.sign({email: req.body.email}, JWT_SECRET, {expiresIn: '24h'});
                    res.status(200).send({message: "Login successful", token, userId: user._id});
                } else {
                    res.status(403).send({token: null, message: "Invalid password", userId: null});
                }
            } else {
                res.status(404).send({token: null, message: "User not fould", userId: null});
            }
        });
    } catch (error) {
        res.status(500).send(error);
    }
}

router.post('/create', multer({storage}).array('upload', 12), registerUser);
router.post('/login', loginUser);

module.exports = router;