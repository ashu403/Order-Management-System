const { Order, validateOrder } = require('../models/order');
const { Product } = require('../models/product');
const { Dealer } = require('../models/dealer');
const { Shopkeeper } = require('../models/shopkeeper');



async function placeOrder(req, res) {
    try {
        const { error } = validateOrder(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        let { orderId, quantity, status, products, dealer, shopkeeper } = req.body;
        const order = await Order.findOne({ orderId: orderId });
        const data = {
            message: "",
            error: false,
            data: null
        };
        if (order) {
            data.message = "Order already exists,Please try again";
            return res.status(400).json(data);
        }
        const productsList = await Product.find({ _id: { $in: products } }).select({ price: 1, name: 1 });

        const dealerOrder = await Dealer.findById(dealer);
        const shopkeeperOrder = await Shopkeeper.findById(shopkeeper);
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


        dealerOrder.orders.push(newOrder._id);
        await dealerOrder.save();
        shopkeeperOrder.orders.push(newOrder._id);
        await shopkeeperOrder.save();
        data.message = "success";
        return res.status(200).json(data);
    } catch (err) {
        const data = { message: err.message, data: null, error: true };
        return res.status(400).json(data);
    }
}


async function getOrderById(req, res) {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId })
            .populate('dealer', 'name -_id')
            .select({ orderId: 1, quantity: 1, totalPrice: 1, status: 1, products: 1, dealer: 1 });
        const data = {
            message: "",
            error: false,
            data: null
        };
        if (!order) {
            data.message = "No order with this Order Id exists";
            return res.status(400).json(data);
        }
        return res.status(200).json(order);

    } catch (err) {
        const data = { message: err.message, data: null, error: true };
        return res.status(400).json(data);
    }
}


async function updateOrder(req, res) {
    try {
        const { status } = req.body;
        const order = await Order.findOne({ orderId: req.params.orderId });
        const data = {
            message: "",
            error: false,
            data: null
        };
        if (!order) {
            data.message = "No order with this Order Id exists";
            return res.status(400).json(data);
        }
        order.status = status;
        await order.save();

        return res.status(200).json(order);

    } catch (err) {
        const data = { message: err.message, data: null, error: true };
        return res.status(400).json(data);
    }
}

module.exports.placeOrder = placeOrder;
module.exports.getOrderById = getOrderById;
module.exports.updateOrder = updateOrder;