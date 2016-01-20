var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var contactSchema= new Schema({
	name: String,
	email: String,
	comment: String
});

contactSchema.statics.findByHost = function (host, cb) {
  return this.find({ host: new RegExp(host, 'i') }, cb);
}



var Contact = mongoose.model('Contact', contactSchema);