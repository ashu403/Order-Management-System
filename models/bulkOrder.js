const mongoose = require('mongoose');
const Joi = require('joi');

const bulkOrderSchema = new mongoose.Schema({

    bulkOrderId: {
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
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    }
});

bulkOrderSchema.methods.calculateTotalPrice = function(quantity, productsList) {
    let totalPrice = 0;
    for (let i = 0; i < quantity.length; i++) {
        totalPrice += (quantity[i] * productsList[i].price);
    }
    return { totalPrice: totalPrice };
}

const BulkOrder = mongoose.model("BulkOrder", bulkOrderSchema);

function validateBulkOrder(bulkOrder) {
    const schema = Joi.object({
        bulkOrderId: Joi.string().required(),
        quantity: Joi.array().required(),
        totalPrice: Joi.number(),
        status: Joi.string().valid(...["Accepted", "Not Accepted", "Shipped", "Waiting", "Waiting For Approval"]),
        orderedAt: Joi.date()
    }).options({ allowUnknown: true });
    return schema.validate(bulkOrder);
}

module.exports.BulkOrder = BulkOrder;
module.exports.validateBulkOrder = validateBulkOrder;