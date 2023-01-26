const bcrypt = require('bcrypt');
const { Shopkeeper, validateShop } = require('../models/shopkeeper');
const { Order } = require('../models/order');
const { Dealer } = require('../models/dealer');



async function addShopkeeper(req, res) {
    try {
        const { error } = validateShop(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        let { shopId, name, email, password, role } = req.body;
        let shop = await Shopkeeper.findOne({ $or: [{ email }, { shopId }] });
        const data = {
            message: "",
            error: false,
            data: null
        };
        if (shop) {
            data.message = "Shopkeeper already exists, try logging in";
            return res.status(200).json(data);
        } else {
            let salt = await bcrypt.genSalt();
            password = await bcrypt.hash(password, salt);
            const newShop = new Shopkeeper({
                shopId,
                name,
                email,
                password,
                role
            });
            await newShop.save();
            data.message = "success";
            return res.status(200).json(data);
        }

    } catch (err) {
        const data = { message: err.message, data: null, error: true };
        return res.status(400).json(data);
    }
}


async function approveOrder(req, res) {
    try {
        const orderId = req.params.orderId;
        let { status } = req.body;
        const order = await Order.findOne({ orderId: orderId });
        const data = {
            message: "",
            error: false,
            data: null
        };
        if (!order) {
            data.message = "No order with this Id exists,Please try again";
            return res.status(400).json(data);
        }
        order.status = status;
        await order.save();
        let { dealer, shopkeeper } = order;
        const dealerOrder = await Dealer.findById(dealer);
        const shopkeeperOrder = await Shopkeeper.findById(shopkeeper);
        dealerOrder.orders.push(order._id);
        await dealerOrder.save();
        shopkeeperOrder.orders.push(order._id);
        await shopkeeperOrder.save();
        data.message = "success";
        return res.status(200).json(data);
    } catch (err) {
        const data = { message: err.message, data: null, error: true };
        return res.status(400).json(data);
    }
}

module.exports.addShopkeeper = addShopkeeper;
module.exports.approveOrder = approveOrder;