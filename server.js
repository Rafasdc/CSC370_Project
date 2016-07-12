"use strict";

var express    = require("express");
var bodyParser = require("body-parser");
var mysql = require('mysql');
var session = require('express-session');


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
app.use(session({
  secret:'pr0jec7_csc3702016',
  resave: true,
  saveUnintialized: true
}))

/*
var auth = function(req,res,next) {
  
  console.log(users.length);
  res.send('Unauthorized');
};
*/


// use the parse to get JSON objects out of the request.
app.use(bodyParser.json());

// server static files from the public/ directory.
app.use(express.static(__dirname+'/public'));


app.post("/login", function(req,res){
  console.log("post request to login");
  var query = connection.query("SELECT username FROM accounts WHERE username='testuser'", function(error,results,fields){
    if(error){
      console.log(error);
      //res.sendStatus(500);
    }
    if (results.length == 0){
      //no such user
      //res.sendStatus(500);
    } else {
      connection.query("SELECT password FROM accounts WHERE username='testuser'",function(error, results,fields){
        if (error){
          console.log(error);
        }
        console.log(results);
        if('letmein' == results[0].password) {
          console.log("YOU ARE IN!");
          //req.session.user = req.body.username;
          res.redirect("http://google.com");
        } else {
          //give out error
          res.sendStatus(500);
        }
      })
    }
    
  });
});

app.post("/register", function (req,res){
  console.log("POST request to: /register");
  var info = req.body;
  console.log(info);
  var test = {username: 'nodetest',email: 'node@node.com',password: 'pass', date_registered : 'NOW()'};
  var query = connection.query('INSERT INTO accounts SET ?',info, function(err, result){
    if (err){
      console.log(err);
    } else {
      //console.log(result);
    }
  });
  console.log(query.sql);
});

app.post("/login", function (req,res){
  console.log("POST Request to :/login");
});

app.get("/gettop", function(req,res){
  console.log("GET Request to :/gettop");
  var response;
  var query = connection.query('SELECT title,rating FROM posts,post_ratings WHERE rating > 0', function(error,results,fields){ 
  //TODO: change value of 0 to what we consider top AND add sort by descending
    if (error){
      console.log(error);
    } else {
      //console.log(results);
      res.json(results);
    }
  })
});

//send HTML via get request
app.get("/test",function(req,res){
  res.sendFile('public/register.html',{root: __dirname});
});



app.listen(process.env.PORT || 3000, function () {

    console.log("Listening on port 3000");


});
