/**
 * Module dependencies.
 * @private
 */
var MaliciosRequestMassage = require("./maliciousRequestMessageModel");
var mongoose = require("mongoose");

/**
 * A factory function for creating new MaliciousRequestMassages.
 * 
 * @param {String} projectId The project's Id.
 * @param {Number} timestamp The Message timestamp.
 * @param {String} attackType The Message Attak type.
 * @returns {mongoose.Model}  Created message.
 */
exports.newMaliciousRequestInstance = (projectId, timestamp, attackType) => {
    return new MaliciosRequestMassage({
        topic: "New Malicious Request Found",
        isSeen: false,
        project: mongoose.Types.ObjectId(projectId),
        timestamp: timestamp,
        attackType: attackType
    });
};