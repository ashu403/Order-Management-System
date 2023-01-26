const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const shopSchema = new mongoose.Schema({

    shopId: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 55
    },

    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
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

    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    }],

    representative: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Representative"
    }
});

shopSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({
            id: this._id,
            shopId: this.shopId,
            role: this.role
        },
        process.env.API_KEY
    );
    return token;
}



const Shopkeeper = mongoose.model("Shopkeeper", shopSchema);

function validateShop(shop) {
    const schema = Joi.object({
        shopId: Joi.string().required(),
        name: Joi.string().min(5).max(55).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{6,16}$/).min(8).required(),
        role: Joi.string().required(),
    }).options({ allowUnknown: true });
    return schema.validate(shop);
}

module.exports.Shopkeeper = Shopkeeper;
module.exports.validateShop = validateShop;