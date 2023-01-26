const express = require('express');
const router = express.Router();
const {
    adminLogin,
    adminRegister,
    dealerLogin,
    shopkeeperLogin,
    representativeLogin
} = require('../../controllers/auth.controller');

//admin registers through this route
router.post('/admin/register', adminRegister);

//login routes
router.post('/admin/login', adminLogin);
router.post('/dealer/login', dealerLogin);
router.post('/shopkeeper/login', shopkeeperLogin);
router.post('/representative/login', representativeLogin);


module.exports = router;