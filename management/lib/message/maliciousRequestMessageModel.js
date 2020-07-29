/**
 * Module dependencies.
 * @private
 */
var mongoose = require("mongoose");
var Message = require("./messageModel");

/**
 * Module variables.
 * @private
 */
var maliciousRequestMessageSchema = new mongoose.Schema({
    timestamp: Number,
    attackType: String
}, {
    discriminatorKey: 'type'
});

module.exports = Message.discriminator("MaliciousRequestMessage",
    maliciousRequestMessageSchema);