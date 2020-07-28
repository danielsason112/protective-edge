const createReverseProxyOptions = require("../lib/reverseProxy/reverseProxyOptions");

const TARGET_HOST = process.env.TARGET_HOST || "localhost";
const TARGET_PORT = parseInt(process.env.TARGET_PORT) || 8080;
const TARGET_PROTOCOL = process.env.TARGET_PROTOCOL || "http:";
const CLIENT_HOST = process.env.CLIENT_HOST || "localhost";
const CLIENT_PORT = parseInt(process.env.CLIENT_PORT) || 8081;
const BLOCKING_MODE = process.env.BLOCKING_MODE == 'true' ? true : false;
const WAF_HOST = process.env.WAF_HOST || "localhost";
const WAF_PORT = parseInt(process.env.WAF_PORT) || 8082;

const options = createReverseProxyOptions({
  targetHost: {
    host: TARGET_HOST,
    port: TARGET_PORT,
    protocol: TARGET_PROTOCOL
  },
  host: CLIENT_HOST,
  port: CLIENT_PORT,
  blocking: BLOCKING_MODE
});

module.exports = {
  reverseProxyOptions: options,
  waf: {
    host: WAF_HOST,
    port: WAF_PORT
  },
  coreRepo: "danielsason112/waf-core",
  localCorePath: "localCoreRepo",
  failedAttemptsLimit: 20,
  coreCronExp: '* * * * * *'
};