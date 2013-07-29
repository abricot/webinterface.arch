/**
 * This is the server side component for the Firefox OS List/Detail app
 * It's only purpose at the moment is to serve static files.
 */
var http = require('http');
var connect = require('connect');
var path = require('path');
var fs = require('fs');

var config = require('./config.js');

// the manifest file needs to be served with this mime type
connect.static.mime.define({'application/x-web-app-manifest+json': ['webapp']});
connect.static.mime.define({'text/cache-manifest': ['appcache']});

// create a simple server
var server = connect()
    .use(connect.static(config.server.distFolder));

// Start up the server on the port specified in the config
var host = process.env.IP || '0.0.0.0';
http.createServer(server).listen(config.server.listenPort, host, 511, function() {
    // // Once the server is listening we automatically open up a browser
    var open = require('open');
    open('http://localhost:' + config.server.listenPort + '/');
});
console.log('Server running at http://localhost:' + config.server.listenPort);
