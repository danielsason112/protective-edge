var MaliciosRequestMassage = require("./maliciousRequestMessageModel");
var Message = require("./messageModel");

exports.createMaliciousRequestMessage = async (newMaliciousRequestMessage) => {
    return new Promise((resolve, reject) => {
        newMaliciousRequestMessage.save((err, message) => {
            err ? reject(err) : resolve(message);
        });
    });
}

exports.findAll = () => {
    return new Promise((resolve, reject) => {
        Message.find({}, (err, messages) => {
            err ? reject(err) : resolve(messages);
        }).sort({
            _id: -1
        });
    });
}

exports.notSeenCount = () => {
    return new Promise((resolve, reject) => {
        Message.countDocuments({
            isSeen: false
        }, (err, count) => {
            err ? reject(err) : resolve(count);
        });
    });
}