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

var PROTO_PATH = __dirname + '/management-api.proto';
var host = process.env.MANAGEMENT_HOST || "localhost";
var port = process.env.MANAGEMENT_PORT || 5001;
var packageDefinition = protoLoader.loadSync(PROTO_PATH);
var packageObject = grpc.loadPackageDefinition(packageDefinition);

/**
 * Module exports.
 * @public
 * @returns {object}
 */

var client = new packageObject.api.ManagementAPI(`${host}:${port}`, grpc.credentials.createInsecure());

// client.newMaliciousRequest({
//     timestamp: Date.now()
// }, (err, response) => {
//     err ? console.log(err) : console.log(response);
// });

// client.ping({}, (err, response) => {
//     err ? console.log(err) : console.log(response);
// });

module.exports = client;