const mongoose = require("mongoose");
const logger = require("./logger");

const dbUrl = process.env.DATABASE_URL;


// Mongoose Connect
(async() => {
    try {
        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        logger.info("MongoDB Connected");
    } catch (err) {
        logger.info(err);
    }
})();