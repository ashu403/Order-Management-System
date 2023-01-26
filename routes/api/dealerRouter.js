const express = require('express');
const router = express.Router();
const { updateOrder, getOrderById } = require('../../controllers/order.controller');
const { verifyAuthToken } = require('../../middlewares/auth');
const { viewOrder } = require('../../controllers/dealer.controller');
const { placeBulkOrder } = require('../../controllers/dealer.controller');
const { dealerAuth } = require('../../middlewares/roleAuth');


//update order status by a shopkeeper
router.put('/updateOrder/:orderId', [verifyAuthToken, dealerAuth], updateOrder);


//view orders by a shopkeeper
router.get('/viewOrders', [verifyAuthToken, dealerAuth], viewOrder);

// track order status
router.get('/trackOrder/:orderId', [verifyAuthToken, dealerAuth], getOrderById);

//placing bulk order
router.post('/placeBulkOrder', [verifyAuthToken, dealerAuth], placeBulkOrder);




module.exports = router;