global.config = require('../config');
var mysql = require('mysql');
var path = require('path');
var url = require('url');
var express = require("express");
var RateLimit = require('express-rate-limit');  
var app = express();

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'testDB'
});
connection.connect(function(err) {
    if (!err) {
        console.log("Database is connected ...");
    } else {
        console.log("Error connecting database ...");
    }
});

exports.login = function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    connection.query('SELECT * FROM users WHERE username = "' + username + '"', function(error, results, fields) {
    if (error) {
            res.send({
                "code": 400,
                "success": "error ocurred",
                "mesage": error
            })
        } else {
            if (results.length > 0) 
            {
                if (password == results[0].password) 
                {
                    connection.query('UPDATE users SET tempPassField = "" WHERE username = "' + username + '"', function(error, results, fields) {
                        if (error) {
                            console.log("UPDATE Falied from login");
                        } else {
                            console.log("UPDATE success from login");
                        }
                    });
                    res.send({
                        "code": 200,
                        "success": "Login Success"
                    });
                }
                else 
                {
                    var tempPass = results[0].tempPassField + (results[0].tempPassField == "" ? "" : ",") + password;
                    connection.query('UPDATE users SET tempPassField = "' + tempPass + '" WHERE username = "' + username + '"', function(error, results, fields) {
                        if (error) {
                            console.log("UPDATE Falied");
                        } else {
                            console.log("UPDATE success");
                        }
                    });
                    res.send({
                        "code": 204,
                        "success": "Email and password does not match"
                    });
                }
            } 
            else 
            {
                res.send({
                    "code": 204,
                    "success": "Email does not exits"
                });
            }
        }
    });
}