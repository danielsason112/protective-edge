var mongoose = require("mongoose");

module.exports = (db) => {
    return mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).catch((error) => {
        console.log(error);
    });
};