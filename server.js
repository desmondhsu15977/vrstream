#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('./app'),
    debug = require('debug')('info:server'),
    http = require('http'),
    IPaddress= getIPaddress(),
    url = require("url"),
    fs = require("fs"),
    path = require("path");

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.OPENSHIFT_NODEJS_PORT || '8080');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, IPaddress, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});
server.on('error', onError);
server.on('listening', onListening);



/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
	
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
	console.warn("Using port: "+val);
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
function getIPaddress() {
        //  Set the environment variables we need.
        var ipaddress = process.env.OPENSHIFT_NODEJS_IP;

        if (typeof ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            ipaddress =  "127.0.0.1";
        }
		return ipaddress;
    }
	
/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = IPaddress;
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
