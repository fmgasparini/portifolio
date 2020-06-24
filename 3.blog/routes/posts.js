var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: '/uploads'});
var { check, validationResult } = require('express-validator');
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

/* GET posts page. */
router.get('/add', function(req, res, next) {
	var categories = db.get('categories');

	categories.find({}, {}, function(err, categories){
		res.render('addpost', {
			'title': 'Add Post',
			'categories': categories
		});
	});
	
});

router.post('/add', upload.single('mainimage'), [
	check('title').not().isEmpty().withMessage('Title field is required'),
	check('body').not().isEmpty().withMessage('Body field is required')
],
function(req, res, next) {

    var errors = validationResult(req);

    var title = req.body.title;
	var category = req.body.category;
	var body = req.body.body;
	var author = req.body.author;
	var date = new Date();

	if (req.file){
		var mainimage = req.file.file_name;
	} else {
		var mainimage = 'noimage.jpg';
	};
    
    console.log(errors);

    if (!errors.isEmpty()){
    	res.render('addpost',{
    		'errors': errors.array()
    	});
    } else {
    	var posts = db.get('posts');
    	posts.insert({
    		'title': title,
    		'body': body,
    		'category': category,
    		'date': date,
    		'author': author,
    		'mainimage': mainimage
    	}, function(err, post){
    		if(err){
    			res.send(err);
    		}	 else {
    			req.flash('success', 'Post added');
    			res.location('/');
    			res.redirect('/');
    		};
    	});
    };

});

module.exports = router;
