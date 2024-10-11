const mongoose = require('mongoose')

const paymentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: String,

});

module.exports = mongoose.model('Payment', paymentSchema)