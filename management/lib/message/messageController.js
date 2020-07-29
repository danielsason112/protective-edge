/**
 * Module dependencies.
 * @private
 */
var messageService = require("./messageService");
var responseMessageFactory = require("../responseMessage").ResponseMessageFactory;
var Message = require("./messageModel");

/**
 * Sends a response with all massages.
 * 
 * @param {HTTP.IncomingMessage} req Client's request.
 * @param {HTTP.ServerResponse} res Servers's response.
 */
exports.getAll = async (req, res) => {
    var messages = await messageService.findAll()
        .catch((err) => {
            return res.send(responseMessageFactory.createUnsuccessful(err.massage));
        });

    res.send(responseMessageFactory.createSuccessful(messages));
};

/**
 * Updates a Message when a user has seen it and sends back a response with the updated messsage.
 * 
 * @param {HTTP.IncomingMessage} req Client's request.
 * @param {HTTP.ServerResponse} res Servers's response.
 */
exports.seen = async (req, res) => {
    Message.updateOne({
        _id: req.params.messageId
    }, {
        isSeen: true
    }, (err, updated) => {
        if (err) {
            return res.send(responseMessageFactory.createUnsuccessful(err.massage));
        }
        res.send(responseMessageFactory.createSuccessful(updated));
    });
}

/**
 * Sends a response with All unseen message count.
 * 
 * @param {HTTP.IncomingMessage} req Client's request.
 * @param {HTTP.ServerResponse} res Servers's response.
 */
exports.unseenCount = async (req, res) => {
    var count = await messageService.notSeenCount()
        .catch((err) => {
            return res.send(responseMessageFactory.createUnsuccessful(err.massage));
        });

    res.send(responseMessageFactory.createSuccessful(count));
};