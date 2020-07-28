var PROTO_PATH = __dirname + '/api.proto';
var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
var managementClient = require("./managementClient");

var counter = 0;
const SEND_BLOCK_STATUS = 20;
const PROJECT_ID = process.env.PROJECT_ID || "5ef97f02b4532d25365cfd5d";

var packageDefinition = protoLoader.loadSync(
    PROTO_PATH, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
var definition = grpc.loadPackageDefinition(packageDefinition);

var server = new grpc.Server();

function IsValidRequest(HTTPRequest, callback) {
    var status = 1; // Allow
    if (counter > SEND_BLOCK_STATUS) {
        status = 0; // Block
        let timestamp = Date.now();
        let type = timestamp % 2 == 0 ? "XSS" : "SQL Injection";
        managementClient.newMaliciousRequest({
            timestamp: timestamp,
            type: type,
            projectId: PROJECT_ID
        }, (err, response) => {
            err ? console.log(err) : console.log(response);
        });
        counter = 0;
    } else {
        counter++;
    }

    console.log("New request recieved, sending " + status + " status.");
    callback(null, {
        status: status
    });
}

const ping = (_, callback) => {
    callback(null, {});
}

server.addService(definition.api.ServerAPI.service, {
    IsValidRequest: IsValidRequest,
    ping: ping
});


server.bind('localhost:8082', grpc.ServerCredentials.createInsecure());
server.start();
console.log(`Server started`);