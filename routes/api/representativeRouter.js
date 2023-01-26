const express = require('express');
const router = express.Router();
const { verifyAuthToken } = require('../../middlewares/auth');
const { placeOrder, addVisitLogs, trackOrder } = require('../../controllers/representative.controller');
const { viewProducts } = require('../../controllers/product.controller');
const { representativeAuth } = require('../../middlewares/roleAuth');

// add visit details
router.put('/addVisitLogs', [verifyAuthToken, representativeAuth], addVisitLogs);

// view products for ordering
router.get('/viewProducts', [verifyAuthToken, representativeAuth], viewProducts);

// add orders for shopkeeper assigned to the representative
router.post('/placeOrder', [verifyAuthToken, representativeAuth], placeOrder);

//track the placed order
router.get('/trackOrder/:orderId', [verifyAuthToken, representativeAuth], trackOrder);

module.exports = router;