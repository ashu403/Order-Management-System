const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const repSchema = new mongoose.Schema({

    repId: {
        type: String,
        required: true,
        unique: true
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

    visitDetails: {
        type: [new mongoose.Schema({
            region: String,
            visitDate: {
                type: Date,
                default: Date.now
            }
        })]
    },

    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    }],

    shopkeeper: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shopkeeper"
    },
});

repSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({
            id: this._id,
            repId: this.repId,
            role: this.role
        },
        process.env.API_KEY
    );
    return token;
}


const Representative = mongoose.model("Representative", repSchema);

function validateRepresentative(representative) {
    const schema = Joi.object({
        repId: Joi.string().required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{6,16}$/).min(8).required(),
        role: Joi.string().required()
    }).options({ allowUnknown: true });
    return schema.validate(representative);
}

module.exports.Representative = Representative;
module.exports.validateRepresentative = validateRepresentative;