var PROTO_PATH = __dirname + '/management-api.proto';
var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
var config = require("../config");
var messageFactory = require("./message").Factory;
var messageService = require("./message").Service;

const HOST = config.grpcHost || "localhost";
const PORT = config.grpcPort || 5001;

var packageDefinition = protoLoader.loadSync(
    PROTO_PATH, {
        keepCase: true,
        longs: Number,
        enums: String,
        defaults: true,
        oneofs: true
    });
var definition = grpc.loadPackageDefinition(packageDefinition);

var server = new grpc.Server();

function newMaliciousRequest(NMRMessage, callback) {
    let {
        timestamp,
        type,
        projectId
    } = NMRMessage.request
    console.log("New malicious Request, timestamp: " + timestamp +
        ", type: " + type + ", for projectId " + projectId);
    messageService.createMaliciousRequestMessage(
        messageFactory.newMaliciousRequestInstance(
            projectId,
            timestamp,
            type
        ));
    callback(null, {});
}

const ping = (_, callback) => {
    callback(null, {});
}

server.addService(definition.api.ManagementAPI.service, {
    newMaliciousRequest: newMaliciousRequest,
    ping: ping
});


server.bind(`${HOST}:${PORT}`, grpc.ServerCredentials.createInsecure());

module.exports = server;