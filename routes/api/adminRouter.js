const express = require('express');
const router = express.Router();
const { addDealer } = require('../../controllers/dealer.controller');
const { addProduct } = require('../../controllers/product.controller');
const { addRepresentative } = require('../../controllers/representative.controller');
const { addShopkeeper } = require('../../controllers/shopkeeper.controller');
const { verifyAuthToken } = require('../../middlewares/auth');
const { trackBulkOrder, updateBulkOrder } = require('../../controllers/bulkOrder.controller');
const { adminAuth } = require('../../middlewares/roleAuth');


//admin add dealers
router.post('/addDealers', [verifyAuthToken, adminAuth], addDealer);

//admin adds shopkeepers
router.post('/addShopkeepers', [verifyAuthToken, adminAuth], addShopkeeper);

//admin add representatives
router.post('/addRepresentatives', [verifyAuthToken, adminAuth], addRepresentative);

//admin adds products
router.post('/addProducts', [verifyAuthToken, adminAuth], addProduct);

// view Orders from Bulk orders
router.get('/trackBulkOrder/:bulkOrderId', [verifyAuthToken, adminAuth], trackBulkOrder);

//update bulk order
router.put('/updateBulkOrder/:bulkOrderId', [verifyAuthToken, adminAuth], updateBulkOrder);



module.exports = router;