"use strict";

var express    = require("express");
var bodyParser = require("body-parser");
var mysql = require('mysql');
var connection = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password: 'rafa1234',
    database: 'project'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

connection.end();

// The server currently uses an in memory
// data store. You must implement the required
// functionality in ./lib/storage.js and
// switch out this variable.
//ar Storage = require('./lib/MongoDB');

var app = express();


// use the parse to get JSON objects out of the request.
app.use(bodyParser.json());

// server static files from the public/ directory.
app.use(express.static('public'));



app.listen(process.env.PORT || 3000, function () {

    console.log("Listening on port 3000");


});
