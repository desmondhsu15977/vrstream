var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Session = mongoose.model('Session');


router.get('/new',function(req, res, next) {
    res.render('session_new',  {  title: 'Register new session'});
});

router.post('/new',function(req, res, next){
	req.body.address="mock address";
	
	console.warn(req.body.host);
	console.warn(req.body.description);
	console.warn(req.body.address);

	var newSession= new Session(req.body);
	
	newSession.save(function(err){
        res.redirect('/host/'+req.body.host);
    });
});

router.get('/delete/:id', function(req, res, next){
	//use ._id to delete
	Session.findByIdAndRemove(req.params.id, function (err, session){
		if(err){
			console.warn("session doesnt exist");
			res.render('404');
		}else{
			res.redirect('/');
		}
	});
	
});


router.get('/:host',  function(req, res,next){
	

	Session.findOneByHost(req.params.host, function (err, session) {
	    if(err){
		console.warn("error retrieving session");
			res.render('error')
		}
		if(session){
			console.warn("session exists");
			res.render('view', {title: 'Watching '+ req.params.host, hostname: req.params.host, address: session.address, description: session.description});
		}
		else {
			console.warn("session doesnt exist");
			res.render('404');
		}
  	});


	
});




module.exports = router;



