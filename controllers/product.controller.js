const { Dealer } = require('../models/dealer');
const { Product, validateProduct } = require('../models/product');

async function addProduct(req, res) {
    try {
        const { error } = validateProduct(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        const { productId, name, price, status, imageUrl, dealer } = req.body;
        const product = await Product.findOne({ productId: productId });
        const existingDealer = await Dealer.findById(dealer);
        const data = {
            message: "",
            error: false,
            data: null
        };
        if (product) {
            data.message = "Product already exists, try again with different Product Id";
            return res.status(200).json(data);
        }
        const newProduct = new Product({
            productId,
            name,
            price,
            status,
            imageUrl,
            dealer
        });
        await newProduct.save();
        existingDealer.products.push(newProduct._id);
        await existingDealer.save();
        data.message = "success";
        return res.status(200).json(data);

    } catch (err) {
        const data = { message: err.message, data: null, error: true };
        return res.status(400).json(data);
    }

}


async function viewProducts(req, res) {
    try {
        const products = await Product.find()
            .populate('dealer', 'name -_id');

        return res.status(200).json(products);
    } catch (err) {
        const data = { message: err.message, data: null, error: true };
        return res.status(400).json(data);
    }
}

module.exports.addProduct = addProduct;
module.exports.viewProducts = viewProducts;