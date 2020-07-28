/**
 * Module dependencies.
 * @private
 */

var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');

/**
 * Module varibles.
 * @private
 */

var PROTO_PATH = __dirname + '/api.proto';
var host = "localhost";
var port = 8082;
var packageDefinition = protoLoader.loadSync(PROTO_PATH);
var packageObject = grpc.loadPackageDefinition(packageDefinition);

/**
 * Module exports.
 * @public
 * @returns {object}
 */

var client = new packageObject.api.ServerAPI(`${host}:${port}`, grpc.credentials.createInsecure());

client.IsValidRequest({
    data: ""
}, (err, response) => {
    err ? console.log(err) : console.log(response);
});

client.ping({}, (err, response) => {
    err ? console.log(err) : console.log(response);
});