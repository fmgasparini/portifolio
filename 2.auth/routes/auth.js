var express = require('express');
var flash = require('connect-flash');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var { check, validationResult } = require('express-validator');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

var User = require('../models/user');

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

    	var name = req.body.name;
	  	var email = req.body.email;
  		var username = req.body.username;
  		var password = req.body.password;
  		var confirmPassword = req.body.confirmpassword;

    	if(req.file){
 		 	var profileimage = req.file.filename;
    	} else {
       		var profileimage = 'noimage.jpg'
   		 };
      	
      	var newUser = new User({
  			name: name,
  			email: email,
  			username: username,
  			password: password,
  			profileimage: profileimage
  		});

  		User.createUser(newUser, function(err, user){
  			if(err) throw err;
  			console.log(user);
  		});

  		req.flash('success', 'You are now registered and can login');

  		res.location('/');
  		res.redirect('/');

  	} else {
  		res.render('register', {
      		errors: errors.array(),
      		title: 'Register'
      	});
  	};
  	
});

router.post('/login',
  passport.authenticate('local',  {failureRedirect: '/auth/login', failureFlash: 'Invalid username/password'}),
  function(req, res) {
    req.flash('success', 'You are now logged in');
    res.redirect('/');
  });

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new localStrategy(function(username, password, done){
	User.getUserByUsername(username, function(err, user){
		if(err) throw err;
		if(!user){
			return done(null, false, {message: 'Unknown user'});
		};

		User.comparePassword(password, user.password, function(err, isMatch){
			if(err) throw done(err);
			if(isMatch){
				return done(null, user);
			} else {
				return done(null, false, {message: 'Invalid Password'});
			};
		});
	});
}));

router.get('/logout', function(req, res){
	req.logout();
	req.flash('success', 'You are now logged out');
	res.redirect('/auth/login');
});

module.exports = router;
