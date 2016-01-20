var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Session = mongoose.model('Session');

/* GET home page. */

router.get('/',  function(req, res,next){

	
	  
	Session.find( function (err, sessions) {
	    if (err) return res.render('500');
	    Session.count().exec(function (err, count) {
	      res.render('index', {
	        title: 'Active Sessions',
	        sessions: sessions
	      });
	    });
  	});
});

router.get('/about',function(req,res,next){
	//res.render("about")
});

module.exports = router;

