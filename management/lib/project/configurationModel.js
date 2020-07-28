var mongoose = require("mongoose");

var configurationSchema = new mongoose.Schema({
    name: String,
    clientProtocol: String,
    clientHost: String,
    clientPort: Number,
    coreProtocol: String,
    coreHost: String,
    corePort: Number,
    blockingMode: Boolean
});

module.exports = mongoose.model("Configuration", configurationSchema);