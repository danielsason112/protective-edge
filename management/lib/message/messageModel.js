/**
 * Module dependencies.
 * @private
 */
var mongoose = require("mongoose");

/**
 * Module variables.
 * @private
 */
var messageSchema = new mongoose.Schema({
    topic: String,
    isSeen: Boolean,
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }
}, {
    timestamps: true,
    discriminatorKey: 'type'
});

module.exports = mongoose.model("Message", messageSchema);