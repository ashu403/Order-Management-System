const Joi = require('joi');
const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    productId: {
        type: String,
        unique: true
    },

    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 55,
    },

    price: {
        type: Number,
        required: true,
        get: v => Math.round(v),
        set: v => Math.round(v)
    },

    status: {
        type: String,
    },

    imageUrl: {
        type: String,
    },

    dealer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dealer"
    }
});

const Product = mongoose.model("Product", productSchema);

function validateProduct(product) {
    const schema = Joi.object({
        productId: Joi.string().required(),
        name: Joi.string().min(5).max(55).required(),
        price: Joi.number().required(),
        status: Joi.string().valid(...["Available", "Not Available"]),
        imageUrl: Joi.string()
    }).options({ allowUnknown: true });
    return schema.validate(product);
}

module.exports.Product = Product;
module.exports.validateProduct = validateProduct;