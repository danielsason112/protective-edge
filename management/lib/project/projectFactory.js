/**
 * Module dependencies.
 * @private
 */
var Project = require("./projectModel");
var Configuration = require("./configurationModel");
var mongoose = require("mongoose");

/**
 * A factory function for creating projects.
 * 
 * @param {String} name Project name.
 * @param {String} protocol project protocol, "http:" or "https:".
 * @param {String} host Project host.
 * @param {Number} port Project port.
 * @param {String} configurationId Project configuration's id.
 * 
 * @returns {mongoose.Model} Created project.
 */
exports.newInstance = (name, protocol, host, port, configurationId) => {
    return new Project({
        name: name,
        protocol: protocol,
        host: host,
        port: port,
        configuration: mongoose.Types.ObjectId(configurationId),
        status: Project.schema.statics.status.WAITING
    });
};

/**
 * A factory function for creating configurations.
 * 
 * @param {String} name Configuration name.
 * @param {String} clientProtocol Client-side protocol, "http:" or "https:".
 * @param {String} clientHost Client-side host.
 * @param {Number} clientPort Client-side port
 * @param {String} coreProtocol Core protocol, "http:" or "https:".
 * @param {String} coreHost Core host .
 * @param {Number} corePort Core port.
 * @param {Boolean} blockingMode True for running in Blocking mode or False otherwise.
 * 
 * @returns {mongoose.Model} Created configuration.
 */
exports.newConfigurationInstace = function (name, clientProtocol, clientHost, clientPort, coreProtocol, coreHost, corePort, blockingMode) {
    if (arguments.length == 1) {
        return new Configuration(name);
    }
    return new Configuration({
        name: name,
        clientHost: clientHost,
        clientPort: clientPort,
        clientProtocol: clientProtocol,
        coreHost: coreHost,
        corePort: corePort,
        coreProtocol: coreProtocol,
        blockingMode: blockingMode
    });
};