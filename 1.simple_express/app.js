var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req,res){
	res.render('index',{title: 'Welcome carai'});
});

app.get('/about', function(req,res){
	res.render('about');
});

app.get('/contact', function(req,res){
	res.render('contact');
});

app.post('/contact/send', function(req,res){
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: 'fernando**********@gmail.com',
			pass: 'descubra'
		}
	});

	var mailOptions = {
		from: 'Fernando Gasparini <fernando**********@gmail.com',
		to: 'fernando**********@gmail.com'	,
		subject: 'Website Submission',
		text: 'You have a submission with the following details... Name: '+ req.body.name 
		    + ' Email: '+req.body.email 
		    + 'Message: '+ req.body.message,
		text: '<p>You have a submission with the following details...</p><ul><li>Name: ' + req.body.name + '</li>'
		    + '<li>Email: ' + req.body.email + '</li>' 
		    + '<li>Message: ' + req.body.message + '</li></ul>'
	};

	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			console.log(error);
			res.redirect('/');
		} else {
			console.log('E-mail sent: ' + info.response);
			res.redirect('/contact');
		}
	});
});

app.listen(3000);
console.log('Server is up!');