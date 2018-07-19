global.config = require('./config');
var express = require("express");
var bodyParser = require('body-parser');
var login = require('./routes/loginroutes');
var url = require('url');
var http = require('http');
var RateLimit = require('express-rate-limit');
var mysql = require('mysql');
var nodemailer = require('nodemailer');  
var app = express();

//For body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));

var connection = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12248317',
    password: 'MANZhn1NKs',
    database: 'sql12248317',
    port: 3306
});
connection.connect(function(err) {
    if (!err) {
        console.log("Database is connected ...");
    } else {
        console.log("Error connecting database ...");
    }
});

//Code for Sending Email
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'indianguru57@gmail.com',
    pass: ''
  }
});

sendEmail = function(results,email){
    var mailOptions = {
      from: 'indianguru57@gmail.com',
      to: email,
      subject: 'Your account tried to hack by an Intruder',
      html: "<p>An intruder from IP address: <b>" + config.ip + "</b> tried to hack your account with the series of passwords :<b>" + results + "</b>. Please Change your password immediately if anyone of your passwords are being compramised</p>"
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
}
//Code for Sending Email Ends

var loginacclimiter = new RateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window 
    delayAfter: 1, // begin slowing down responses after the first request 
    delayMs: 0, // slow down subsequent responses by 3 seconds per request 
    max: 5, // start blocking after 5 requests
    message: "Too many login attempts from this IP, please try again after an hour",
    keyGenerator: function(req){
        config.ip = req.ip;
    },
    onLimitReached: function(req, res) {
        connection.query('SELECT tempPassField FROM users WHERE username = "' + req.body.username + '"', function(error, results, fields) {
            if (error) {
                console.log("query failed");
            } else if(results.length > 0 && results[0] && results[0].tempPassField != "") {
                var crackPass = results[0].tempPassField;
                connection.query('SELECT email FROM users WHERE username = "' + req.body.username + '"', function(error, results, fields) {
                     if (error) {
                        console.log("query failed");
                    }
                    else
                    {
                        sendEmail(crackPass,results[0].email);
                        console.log(results);
                    }
                });
            }
        });
        connection.query('UPDATE users SET tempPassField = "" WHERE username = "' + req.body.username + '"', function(error, results, fields) {
            if (error) {
                console.log("UPDATE Falied from login");
            } else {
                console.log("UPDATE success from login");
            }
        });
    }
});

app.use('/home', function(req, res){

	res.sendFile(__dirname + '/login.html');

});

var router = express.Router();

router.post('/login',loginacclimiter,login.login);

app.use('/api', router);

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
