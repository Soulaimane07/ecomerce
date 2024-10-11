const mongoose = require('mongoose')

const clientSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: String,
    tel: Number
});

module.exports = mongoose.model('Client', clientSchema)