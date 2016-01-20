var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Contact = mongoose.model('Contact');

/* GET contact us page. */

router.get('/',  function(req, res,next){
	res.render('contact_us', {title: 'Contact Us'});
});

/*
 * POST to contact us page.
 */
router.post('/',function(req, res, next){
	var newContact= new Contact(req.body);
	newContact.save(function(err){
        res.redirect('/');
    });
});

	

module.exports = router;

