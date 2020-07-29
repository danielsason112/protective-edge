/**
 * Module dependencies.
 * @private
 */
var MaliciosRequestMassage = require("./maliciousRequestMessageModel");
var Message = require("./messageModel");
const {
    Mongoose
} = require("mongoose");

/**
 * Creates a new MaliciousRequestMessage in th db.
 * 
 * @param {Mongoose.Model} newMaliciousRequestMessage A new malicious request message to save.
 * @returns {Promise} resolves when the document is saved or rejects on an error.
 */
exports.createMaliciousRequestMessage = async (newMaliciousRequestMessage) => {
    return new Promise((resolve, reject) => {
        newMaliciousRequestMessage.save((err, message) => {
            err ? reject(err) : resolve(message);
        });
    });
}

/**
 * Returns all of the Messages in the db.
 * 
 * @returns {Promise} resolves when all documents sorted by desc creation time are retrieved or rejects on an error.
 */
exports.findAll = () => {
    return new Promise((resolve, reject) => {
        Message.find({}, (err, messages) => {
            err ? reject(err) : resolve(messages);
        }).sort({
            _id: -1
        });
    });
}

/**
 * Returns all of the unseen Messages in the db count.
 * 
 * @returns {Promise} resolves when all documents count is retrieved or rejects on an error.
 */
exports.notSeenCount = () => {
    return new Promise((resolve, reject) => {
        Message.countDocuments({
            isSeen: false
        }, (err, count) => {
            err ? reject(err) : resolve(count);
        });
    });
}