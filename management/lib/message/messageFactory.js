var MaliciosRequestMassage = require("./maliciousRequestMessageModel");
var mongoose = require("mongoose");

exports.newMaliciousRequestInstance = (projectId, timestamp, attackType) => {
    return new MaliciosRequestMassage({
        topic: "New Malicious Request Found",
        isSeen: false,
        project: mongoose.Types.ObjectId(projectId),
        timestamp: timestamp,
        attackType: attackType
    });
};