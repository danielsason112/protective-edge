var messageFactory = require("./messageFactory");
var messageService = require("./messageService");
var responseMessageFactory = require("../responseMessage").ResponseMessageFactory;
var Message = require("./messageModel");

exports.getAll = async (req, res) => {
    var messages = await messageService.findAll()
        .catch((err) => {
            return res.send(responseMessageFactory.createUnsuccessful(err.massage));
        });

    res.send(responseMessageFactory.createSuccessful(messages));
};

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

exports.unseenCount = async (req, res) => {
    var count = await messageService.notSeenCount()
        .catch((err) => {
            return res.send(responseMessageFactory.createUnsuccessful(err.massage));
        });

    res.send(responseMessageFactory.createSuccessful(count));
};