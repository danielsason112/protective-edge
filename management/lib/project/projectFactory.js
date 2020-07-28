var Project = require("./projectModel");
var Configuration = require("./configurationModel");
var mongoose = require("mongoose");

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