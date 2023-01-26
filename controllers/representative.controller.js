const bcrypt = require('bcrypt');
const { Representative, validateRepresentative } = require('../models/representative');
const { Shopkeeper } = require('../models/shopkeeper');
const { Order, validateOrder } = require('../models/order');
const { Product } = require('../models/product');

async function addRepresentative(req, res) {
    try {
        const { error } = validateRepresentative(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        let { repId, email, password, role, shopkeeper } = req.body;
        let rep = await Representative.findOne({ $or: [{ email }, { repId }] });
        const data = {
            message: "",
            error: false,
            data: null
        };
        if (rep) {
            data.message = "Representative already exists, try logging in";
            return res.status(200).json(data);
        } else {
            const existingShopkeeper = await Shopkeeper.findById(shopkeeper);
            let salt = await bcrypt.genSalt();
            password = await bcrypt.hash(password, salt);
            const newRep = new Representative({
                repId,
                email,
                password,
                role,
                shopkeeper
            });
            await newRep.save();
            if (!existingShopkeeper.representative) {
                existingShopkeeper.representative = newRep._id;
                await existingShopkeeper.save();
            }

            data.message = "success";
            return res.status(200).json(data);
        }
    } catch (err) {
        const data = { message: err.message, data: null, error: true };
        return res.status(400).json(data);
    }
}

async function placeOrder(req, res) {
    try {
        const { error } = validateOrder(req.body);
        if (error) return res.status(400).json(error.details[0].message);
        const data = {
            message: "",
            error: false,
            data: null
        };
        let { orderId, quantity, status, products, dealer, shopkeeper } = req.body;
        const order = await Order.findOne({ orderId: orderId });
        if (order) {
            data.message = "Order already exists,Please try again";
            return res.status(400).json(data)
        }
        const representative = await Representative.findOne({ repId: req.user.repId });


        if (representative.shopkeeper != shopkeeper) {
            data.message = "This representative is not assigned to this shopkeeper,Please try again";
            return res.status(400).json(data)
        }

        const productsList = await Product.find({ _id: { $in: products } }).select({ price: 1, name: 1 });

        status = "Waiting For Approval";
        const newOrder = new Order({
            orderId,
            quantity,
            status,
            products,
            dealer,
            shopkeeper
        });
        const { totalPrice } = newOrder.calculateTotalPrice(quantity, productsList);
        newOrder.totalPrice = totalPrice;

        await newOrder.save();
        representative.orders.push(newOrder);
        await representative.save();
        data.message = "Success";
        return res.status(200).json(data);

    } catch (err) {
        const data = { message: err.message, data: null, error: true };
        return res.status(400).json(data);
    }
}


async function addVisitLogs(req, res) {
    try {
        const { repId } = req.user;
        const representative = await Representative.findOne({ repId: repId });
        const { region } = req.body;
        const data = {
            message: "",
            error: false,
            data: null
        };
        representative.visitDetails.push({
            region: region
        });
        await representative.save();
        data.message = "success";
        return res.status(400).json(data);

    } catch (err) {
        const data = { message: err.message, data: null, error: true };
        return res.status(400).json(data);
    }
}


async function trackOrder(req, res) {
    try {
        let orderId = req.params.orderId;
        const order = await Order.findOne({ orderId: orderId });
        const data = {
            message: "",
            error: false,
            data: null
        };
        if (!order) {
            data.message = "No order with this orderId exists";
            return res.status(400).json(data);
        }
        let representative = await Representative.findOne({ repId: req.user.repId });

        const orderIncluded = representative.orders.includes(order._id);

        if (!orderIncluded) {
            data.message = "No such order is placed by representative";
            return res.status(200).json(data);
        }

        return res.status(200).json(order);
    } catch (err) {
        const data = { message: err.message, data: null, error: true };
        return res.status(400).json(data);
    }

}




module.exports.addRepresentative = addRepresentative;
module.exports.placeOrder = placeOrder;
module.exports.addVisitLogs = addVisitLogs;
module.exports.trackOrder = trackOrder;