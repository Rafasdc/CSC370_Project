"use strict";

var express    = require("express");
var bodyParser = require("body-parser");
var mysql = require('mysql');


var connection = mysql.createConnection({
    host    : 'localhost',
    user    : 'csc370_admin',
    password: 'finalProject',
    database: 'csc370_project'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected to SQL as id ' + connection.threadId);
});


var app = express();


// use the parse to get JSON objects out of the request.
app.use(bodyParser.json());

// server static files from the public/ directory.
app.use(express.static('public'));


app.post("/register", function (req,res){
  console.log("POST request to: /register");
  var info = req.body;
  console.log(info);
  var test = {username: 'nodetest',email: 'node@node.com',password: 'pass', date_registered : 'NOW()'};
  var query = connection.query('INSERT INTO accounts SET ?',info, function(err, result){
    if (err){
      console.log(err);
    } else {
      console.log(result);
    }
  });
  console.log(query.sql);
});

app.post("/login", function (req,res){
  console.log("POST Request to :/login");
});

app.post("")



app.listen(process.env.PORT || 3000, function () {

    console.log("Listening on port 3000");


});
