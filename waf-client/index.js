var reverseProxy = require('./lib/reverseProxy');
var reverseProxyOptions = require('./config').reverseProxyOptions;

console.log(reverseProxyOptions);

var proxy = new reverseProxy(reverseProxyOptions);

proxy.listen();