/**
 * Module dependencies.
 * @private
 */
var mongoose = require("mongoose");
var Configuration = require("./configurationModel");

var projectSchema = new mongoose.Schema({
    protocol: String,
    host: String,
    port: Number,
    name: String,
    configuration: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Configuration'
    },
    status: String
}, {
    timestamps: true
});

projectSchema.statics.status = {
    WAITING: 0,
    ACTIVE: 1,
    ERROR: 2
}

module.exports = mongoose.model("Project", projectSchema);