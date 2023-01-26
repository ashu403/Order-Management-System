const bcrypt = require("bcrypt");
const { Admin, validateAdmin } = require('../models/admin');
const { Dealer } = require('../models/dealer');
const { Shopkeeper } = require('../models/shopkeeper');
const { Representative } = require('../models/representative');


async function adminRegister(req, res) {
    try {
        const { error } = validateAdmin(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        let { adminId, name, email, password, role } = req.body;
        let admin = await Admin.findOne({ $or: [{ email }, { adminId }] });
        const data = {
            message: "",
            error: false,
            data: null
        };
        if (admin) {
            data.message = "Admin already exists, try logging in";
            return res.status(200).json(data);
        } else {

            let salt = await bcrypt.genSalt();
            password = await bcrypt.hash(password, salt);
            const newAdmin = new Admin({
                adminId,
                name,
                email,
                password,
                role
            });
            await newAdmin.save();
            data.message = "success";
            return res.status(200).json(data);
        }

    } catch (err) {
        const data = { message: err.message, data: null, error: true };
        return res.status(400).json(data);
    }
}

async function adminLogin(req, res) {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email: email });
        const data = {
            message: "",
            error: false,
            data: null
        };
        if (!admin) {
            data.message = "Invalid username or Password";
            return res.status(401).json(data)
        }
        const checkPass = await bcrypt.compare(password, admin.password);
        if (!checkPass) {
            data.message = "Invalid username or Password";
            return res.status(401).json(data);
        }

        const token = admin.generateAuthToken();
        data.message = "success";
        return res.status(200).header("x-auth-token", token).json(data);

    } catch (err) {
        const data = { message: err.message, error: true, data: null };
        return res.status(400).json(data);
    }
}

async function dealerLogin(req, res) {
    try {
        const { email, password } = req.body;
        const dealer = await Dealer.findOne({ email: email });
        const data = {
            message: "",
            error: false,
            data: null
        };
        if (!dealer) {
            data.message = "Invalid username or Password";
            return res.status(401).json(data)
        }
        const checkPass = await bcrypt.compare(password, dealer.password);
        if (!checkPass) {
            data.message = "Invalid username or Password";
            return res.status(401).json(data);
        }

        const token = dealer.generateAuthToken();
        data.message = "success";
        return res.status(200).header("x-auth-token", token).json(data);

    } catch (err) {
        const data = { message: err.message, error: true, data: null };
        return res.status(400).json(data);
    }
}


async function shopkeeperLogin(req, res) {
    try {
        const { email, password } = req.body;
        const shopkeeper = await Shopkeeper.findOne({ email: email });
        const data = {
            message: "",
            error: false,
            data: null
        };
        if (!shopkeeper) {
            data.message = "Invalid username or Password";
            return res.status(401).json(data)
        }
        const checkPass = await bcrypt.compare(password, shopkeeper.password);
        if (!checkPass) {
            data.message = "Invalid username or Password";
            return res.status(401).json(data);
        }

        const token = shopkeeper.generateAuthToken();
        data.message = "success";
        return res.status(200).header("x-auth-token", token).json(data);

    } catch (err) {
        const data = { message: err.message, error: true, data: null };
        return res.status(400).json(data);
    }
}


async function representativeLogin(req, res) {
    try {
        const { email, password } = req.body;
        const representative = await Representative.findOne({ email: email });
        const data = {
            message: "",
            error: false,
            data: null
        };
        if (!representative) {
            data.message = "Invalid username or Password";
            return res.status(401).json(data)
        }
        const checkPass = await bcrypt.compare(password, representative.password);
        if (!checkPass) {
            data.message = "Invalid username or Password";
            return res.status(401).json(data);
        }

        const token = representative.generateAuthToken();
        data.message = "success";
        return res.status(200).header("x-auth-token", token).json(data);

    } catch (err) {
        const data = { message: err.message, error: true, data: null };
        return res.status(400).json(data);
    }
}





module.exports.adminRegister = adminRegister;
module.exports.adminLogin = adminLogin;
module.exports.dealerLogin = dealerLogin;
module.exports.shopkeeperLogin = shopkeeperLogin;
module.exports.representativeLogin = representativeLogin;