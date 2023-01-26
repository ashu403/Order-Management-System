async function adminAuth(req, res, next) {
    try {
        const { role } = req.user;
        if (role === 'Admin') {
            next();
        }
        const data = {
            message: "",
            data: null,
            error: false
        };
        data.message = "You are not authorized to access this route";
        return res.status(403).json(data);
    } catch (err) {
        const data = { message: err.message, data: null, error: true };
        return res.status(400).json(data);
    }
}


async function dealerAuth(req, res, next) {
    try {
        const { role } = req.user;
        if (role === 'Dealer') {
            next();
        }
        const data = {
            message: "",
            data: null,
            error: false
        };
        data.message = "You are not authorized to access this route";
        return res.status(403).json(data);

    } catch (err) {
        const data = { message: err.message, data: null, error: true };
        return res.status(400).json(data);
    }
}


async function shopkeeperAuth(req, res, next) {
    try {
        const { role } = req.user;
        if (role === 'Shopkeeper') {
            next();
        }
        const data = {
            message: "",
            data: null,
            error: false
        };
        data.message = "You are not authorized to access this route";
        return res.status(403).json(data);
    } catch (err) {
        const data = { message: err.message, data: null, error: true };
        return res.status(400).json(data);
    }
}


async function representativeAuth(req, res, next) {
    try {
        const { role } = req.user;
        if (role === 'Representative') {
            next();
        }
        const data = {
            message: "",
            data: null,
            error: false
        };
        data.message = "You are not authorized to access this route";
        return res.status(403).json(data);
    } catch (err) {
        const data = { message: err.message, data: null, error: true };
        return res.status(400).json(data);
    }
}


module.exports.adminAuth = adminAuth;
module.exports.dealerAuth = dealerAuth;
module.exports.shopkeeperAuth = shopkeeperAuth;
module.exports.representativeAuth = representativeAuth;