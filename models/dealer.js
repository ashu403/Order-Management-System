const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const dealerSchema = new mongoose.Schema({

    dealerId: {
        type: String,
        unique: true,
        required: true
    },

    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 55,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255,
    },

    password: {
        type: String,
        required: true,
        minlength: 8
    },

    role: {
        type: String,
        required: true
    },

    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],

    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    }],

    bulkOrders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "BulkOrder"
    }]
});

dealerSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({
            id: this._id,
            dealerId: this.dealerId,
            role: this.role
        },
        process.env.API_KEY
    );
    return token;
}


const Dealer = mongoose.model("Dealer", dealerSchema);

function validateDealer(dealer) {
    const schema = Joi.object({
        dealerId: Joi.string().required(),
        name: Joi.string().min(5).max(55).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{6,16}$/).min(8).required(),
        role: Joi.string().required(),
    }).options({ allowUnknown: true });
    return schema.validate(dealer);
}



module.exports.Dealer = Dealer;
module.exports.validateDealer = validateDealer;