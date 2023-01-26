const jwt = require('jsonwebtoken');
require('dotenv').config();

async function verifyAuthToken(req, res, next) {
    try {
        const token = req.header('x-auth-token');
        if (token === null || token === 'null') {
            return res.status(401).send('Unauthorized Request');
        }
        const payload = jwt.verify(token, process.env.API_KEY);
        if (!payload) {
            return res.status(401).send('Unauthorized Request');
        }
        req.user = payload;
        next();
    } catch (err) {
        const data = { message: err.message, error: true, data: null };
        return res.status(400).json(data);
    }
}


module.exports.verifyAuthToken = verifyAuthToken;