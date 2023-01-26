const { Dealer, validateDealer } = require('../models/dealer');
const { BulkOrder, validateBulkOrder } = require('../models/bulkOrder');
const { Product } = require('../models/product');
const { Admin } = require('../models/admin');
const bcrypt = require('bcrypt');


async function addDealer(req, res) {
    try {
        const { error } = validateDealer(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        let { dealerId, name, email, password, role } = req.body;
        let dealer = await Dealer.findOne({ $or: [{ email }, { dealerId }] });
        const data = {
            message: "",
            error: false,
            data: null
        };
        if (dealer) {
            data.message = "Dealer already exists, try logging in";
            return res.status(200).json(data);
        } else {
            let salt = await bcrypt.genSalt();
            password = await bcrypt.hash(password, salt);
            const newDealer = new Dealer({
                dealerId,
                name,
                email,
                password,
                role
            });
            await newDealer.save();
            data.message = "success";
            return res.status(200).json(data);
        }

    } catch (err) {
        const data = { message: err.message, data: null, error: true };
        return res.status(400).json(data);
    }
}


async function viewOrder(req, res) {
    try {
        const { dealerId } = req.user;
        const orders = await Dealer.findOne({ dealerId: dealerId }).populate('orders').select({ orders: 1 });
        return res.status(200).json(orders);
    } catch (err) {
        const data = { message: err.message, data: null, error: true };
        return res.status(400).json(data);
    }
}

async function placeBulkOrder(req, res) {
    try {
        const { error } = validateBulkOrder(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        let { bulkOrderId, quantity, status, products, dealer, admin } = req.body;
        const bulkOrder = await BulkOrder.findOne({ bulkOrderId: bulkOrderId });
        const data = {
            message: "",
            error: false,
            data: null
        };
        if (bulkOrder) {
            data.message = "Order already exists,Please try again";
            return res.status(400).json(data);
        }

        const productsList = await Product.find({ _id: { $in: products } }).select({ price: 1, name: 1 });


        const dealerOrder = await Dealer.findById(dealer);
        const newBulkOrder = new BulkOrder({
            bulkOrderId,
            quantity,
            status,
            products,
            dealer,
            admin
        });

        const { totalPrice } = newBulkOrder.calculateTotalPrice(quantity, productsList);
        newBulkOrder.totalPrice = totalPrice;
        await newBulkOrder.save();
        dealerOrder.bulkOrders.push(newBulkOrder._id);
        await dealerOrder.save();
        data.message = "success";
        return res.status(200).json(data);
    } catch (err) {
        const data = { message: err.message, data: null, error: true };
        return res.status(400).json(data);
    }
}




module.exports.addDealer = addDealer;
module.exports.viewOrder = viewOrder;
module.exports.placeBulkOrder = placeBulkOrder;