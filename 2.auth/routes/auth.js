var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var { check, validationResult } = require('express-validator');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {title: 'Register'});
});

router.get('/login', function(req, res, next) {
  res.render('login', {title: 'Login'});
});

router.post('/register', upload.single('profileimage'), 
	[	check('name')
			.not().isEmpty().withMessage('Name field is required'),
	    check('email')
	        .not().isEmpty().withMessage('Email field is required')
			.isEmail().withMessage('Must provide a valid email'),
		check('username')
			.not().isEmpty().withMessage('Username field is required'),
		check('password')
			.not().isEmpty().withMessage('Password field is required')
			.isLength({min: 6, max: 20}).withMessage('Minimum length is six characters')
			.custom((value,{req, loc, path}) => {
            if (value !== req.body.confirmpassword) {
                // trow error if passwords do not match
                throw new Error("Passwords don't match");
            } else {
                return value;
            }
        })
	],
  function(req, res, next) {
    
    var errors = validationResult(req);

    if (errors.isEmpty()){
      	null;
  	} else {
  		res.render('register', {
      		errors: errors.array(),
      		title: 'Register'
      	});
  	}

  	var name = req.body.name;
  	var email = req.body.email;
  	var username = req.body.username;
  	var password = req.body.password;
  	var confirmPassword = req.body.confirmpassword;

	if(req.file){
 	 	var profileimage = req.file.filename;
    } else {
  		var profileimage = 'nomeimage.jpg';
    };

});

module.exports = router;
