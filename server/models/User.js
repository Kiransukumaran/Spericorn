const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {},
    role: {
        type: String,
        default: 'USER'
    },
    created: {
        type: Date,
        default: new Date()
    }
});

module.exports = mongoose.model('User', userSchema);
