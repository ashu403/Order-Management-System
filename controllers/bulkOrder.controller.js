const { BulkOrder } = require('../models/bulkOrder');


async function trackBulkOrder(req, res) {

    try {
        const bulkOrderId = req.params.bulkOrderId;
        const bulkOrder = await BulkOrder.findOne({ bulkOrderId: bulkOrderId });
        return res.status(400).json(bulkOrder);
    } catch (err) {
        const data = { message: err.message, data: null, error: true };
        return res.status(400).json(data);
    }

}


async function updateBulkOrder(req, res) {
    try {
        const { status } = req.body;
        const bulkOrder = await BulkOrder.findOne({ bulkOrderId: req.params.bulkOrderId });
        const data = {
            message: "",
            error: false,
            data: null
        };

        if (!bulkOrder) {
            data.message = "This bulkOrder does not exists with this bulkOrder Id";
            return res.status(400).json(data);
        }

        bulkOrder.status = status;
        await bulkOrder.save();

        return res.status(200).json(bulkOrder);

    } catch (err) {
        const data = { message: err.message, data: null, error: true };
        return res.status(400).json(data);
    }

}


module.exports.trackBulkOrder = trackBulkOrder;
module.exports.updateBulkOrder = updateBulkOrder;