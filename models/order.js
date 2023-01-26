const mongoose = require('mongoose');
const Joi = require('joi');

const orderSchema = new mongoose.Schema({

    orderId: {
        type: String,
        required: true,
        unique: true
    },

    quantity: [{
        type: Number,
        required: true,
    }],

    totalPrice: {
        type: Number,
        required: true,
        get: v => Math.round(v),
        set: v => Math.round(v)
    },

    status: {
        type: String,
        enum: ["Accepted", "Not Accepted", "Shipped", "Waiting", "Waiting For Approval"],
        required: true,
    },

    orderedAt: {
        type: Date,
        default: Date.now
    },

    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],

    dealer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dealer"
    },

    shopkeeper: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shopkeeper"
    }
});

orderSchema.methods.calculateTotalPrice = function(quantity, productsList) {
    let totalPrice = 0;
    for (let i = 0; i < quantity.length; i++) {
        totalPrice += (quantity[i] * productsList[i].price);
    }
    return { totalPrice: totalPrice };
}

const Order = mongoose.model("Order", orderSchema);

function validateOrder(order) {
    const schema = Joi.object({
        orderId: Joi.string().required(),
        quantity: Joi.array().required(),
        totalPrice: Joi.number(),
        status: Joi.string().valid(...["Accepted", "Not Accepted", "Shipped", "Waiting", "Waiting For Approval"]),
        orderedAt: Joi.date()
    }).options({ allowUnknown: true });
    return schema.validate(order);
}

module.exports.Order = Order;
module.exports.validateOrder = validateOrder;