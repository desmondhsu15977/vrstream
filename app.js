var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var BinaryServer = require('binaryjs').BinaryServer;
var fs = require('fs');



//import schema
fs.readdirSync(path.join(__dirname, 'public/schema')).forEach(function (file) {
  if (~file.indexOf('.js')) require(path.join(__dirname, 'public/schema', file));
});


var routes = require('./routes/index');
var sessions = require('./routes/sessions');
var host = require('./routes/host');
var contact_us = require('./routes/contact_us');

var mongoose = require('mongoose');
var db = mongoose.connect(getDBaddress());//setup DB address



var app = module.exports = express();




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('db',db);
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req,res,next){
    req.db = db;
    next();
});




app.use('/', routes);
app.use('/sessions', sessions);
app.use('/host', host);
app.use('/contact_us', contact_us);


//setup db location for local and openshift
function getDBaddress(){
	var db_name="vrstream"
	//provide a sensible default for local development
	var mongodb_connection_string = 'mongodb://127.0.0.1:27017/' + db_name;
	//take advantage of openshift env vars when available:
	if(process.env.OPENSHIFT_MONGODB_DB_URL){
	  mongodb_connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + db_name;
	}
	console.warn("DB using: "+mongodb_connection_string);
	return  mongodb_connection_string;
	
}


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var hosts={};
var server = BinaryServer({port: 8081});
server.on('connection', function(client){
  client.on('error', function(e) {
    console.log(e.stack, e.message);
  });
  client.on('stream', function(stream, meta){
    console.warn(meta);
    if(meta.type == 'write') {
      console.warn('host connected: '+meta.hostname);
      hosts[stringToInt(meta.hostname)] = stream;
    } else if (meta.type == 'read') {
      if(hosts[stringToInt(meta.hostname)]){
        console.warn('viewer connected: '+ meta.hostname);
        hosts[stringToInt(meta.hostname)].pipe(stream);
      }else{
        console.warn('try to connect non-exist stream');
      }
    }
 });
});


function stringToInt(str) {
  var result=0;
  for(var i=0;i<str.length;i++){
    result += str.charCodeAt(i)*str.charCodeAt(i)*i;
  }
  return result;
}


module.exports = app;