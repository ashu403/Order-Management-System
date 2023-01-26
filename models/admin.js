const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const adminSchema = new mongoose.Schema({

    adminId: {
        type: String,
        required: true,
        unique: true
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

});

adminSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({
            id: this._id,
            adminId: this.adminId,
            role: this.role
        },
        process.env.API_KEY
    );
    return token;
}


const Admin = mongoose.model("Admin", adminSchema);

function validateAdmin(admin) {
    const schema = Joi.object({
        adminId: Joi.string().required(),
        name: Joi.string().min(5).max(55).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{6,16}$/).min(8).required(),
        role: Joi.string().required(),
    });
    return schema.validate(admin);
}

module.exports.Admin = Admin;
module.exports.validateAdmin = validateAdmin;