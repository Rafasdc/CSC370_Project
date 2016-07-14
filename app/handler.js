var config       = require('../config');
var utils        = require('./utils');
var database     = require('./database');

var Handler;
Handler = (function() {

  //Empty constructor
  function Handler() {}



 Handler.getPost = function(req,res){
 	//check post exists here
 	return res.sendFile('public/display_post.html', {root: "."}); //. = directory where server.js is 
 }

 
 Handler.sendSubsaiddit = function (req,res){
 	//check subsaiddit exits here
 	console.log("HERE");
 	return res.sendFile('/public/subsaiddit.html',{root: "."}); //. = directory where server.js is
 }




return Handler;
})();

module.exports = Handler;