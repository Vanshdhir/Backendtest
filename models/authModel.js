const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
    username: {
        type: String,
        requires: true
    },
    email: {
        type: String,
        requires: true,
        
    },
    password: {
        type: String,
        requires: true
    }
})

const authModel = mongoose.model('User', authSchema);

module.exports = authModel;