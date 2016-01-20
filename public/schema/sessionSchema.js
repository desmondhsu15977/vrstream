var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var sessionSchema= new Schema({
	host: String,
	address: String,
	description: String
});

sessionSchema.statics.findOneByHost = function (host, cb) {
  return this.findOne({ host: new RegExp(host, 'i') }, cb);
}



var Session = mongoose.model('Session', sessionSchema);