const express = require('express');
const router = express.Router();
const { placeOrder, getOrderById } = require('../../controllers/order.controller');
const { verifyAuthToken } = require('../../middlewares/auth');
const { approveOrder } = require('../../controllers/shopkeeper.controller');
const { viewProducts } = require('../../controllers/product.controller');
const { shopkeeperAuth } = require('../../middlewares/roleAuth');


//shopkeeper order routes
router.post('/placeOrder', [verifyAuthToken, shopkeeperAuth], placeOrder);
// track orders 
router.get('/viewOrders/:orderId', [verifyAuthToken, shopkeeperAuth], getOrderById);

//approve orders ordered by representative
router.put('/approveOrders/:orderId', [verifyAuthToken, shopkeeperAuth], approveOrder);

// shopkeeper product routes
router.get('/viewProducts', [verifyAuthToken, shopkeeperAuth], viewProducts);



module.exports = router;