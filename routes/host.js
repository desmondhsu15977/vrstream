var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Session = mongoose.model('Session');

router.get('/:host',function(req, res, next) {
	Session.findOneByHost(req.params.host, function (err, session) {
	    if(err){
		console.warn("error retrieving session");
			res.render('error')
		}
		if(session){
			console.warn("session exists");
			res.render('host', {title: 'Hosting as '+ req.params.host, hostname: req.params.host, address: session.address, description: session.description});
		}
		else {
			console.warn("session doesnt exist");
			res.render('404');
		}
  	});
    
    
});




module.exports = router;