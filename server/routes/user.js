const express = require('express');
const User = require('../models/User');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

router.use(verifyToken);

const getUserDetails = async (req, res, next) => {
    try {
        await User.find({}, {password: 0}).then(users => {
            res.status(200).send(users);
        });
    } catch (error) {
        res.status(500).send(error);
    }
}

router.get('/', getUserDetails);

module.exports = router;
