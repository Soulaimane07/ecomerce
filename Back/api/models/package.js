const mongoose = require('mongoose')

const packageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    image: String,
    title: String,
    description: String,
    price: Number,
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
    ]
});

module.exports = mongoose.model('Package', packageSchema)