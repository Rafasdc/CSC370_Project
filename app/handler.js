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
 	query= database.getConnection().query("SELECT title FROM subsaiddits WHERE title=?",req.params.subsaiddit,function(error,results,fields){
 		if (error){
      	console.log(error);
    	} else {
      		if (results.length == 0){
      			res.status(404).send("Subsaiddit Does not Exist");
      		} else {
      			return res.sendFile('/public/subsaiddit.html',{root: "."}); //. = directory where server.js is
      		}
    	}
 	})
 	//check subsaiddit exits here
 	//console.log("HERE");

 }

 Handler.sendNotAuthorized = function (req,res){
 	res.status(401).send("Must be logged in");
 }


Handler.sendSubsaidditPosts = function (req,res){
	console.log("get request to getSubsaidditPosts");
	console.log(req.params.subsaiddit);
	var query = database.getConnection().query("SELECT title,rating,url FROM posts LEFT JOIN post_ratings ON posts.id = post_ratings.post WHERE subsaiddit=?",req.params.subsaiddit, function(error,results,fields){
    if (error){
      console.log(error);
    } else {
      //console.log(results);
      res.send(results);
    }
  })
}


  Handler.sendSubscribed = function (req,res){
  	var query = database.getConnection().query("SELECT subsaiddit FROM subscriptions WHERE account= (SELECT username FROM accounts WHERE id=?)",req.accountID, function(error,results,fields){
     if (error){
       console.log(error);
     } else {
       console.log(results);
       res.send(results);
     }
   })
  }

   Handler.isSubscribed = function (req,res){
    console.log("get request for isSubscribed " + req.accountID + " " + req.params.subsaiddit);
   	var query = database.getConnection().query("SELECT subsaiddit FROM subscriptions WHERE account= (SELECT username FROM accounts WHERE id=?) AND subsaiddit = ?",[req.accountID, req.params.subsaiddit], function(error,results,fields){
      if (error){
        console.log(error);
      } else {
          console.log(results);
        res.send({subscribed:results.length != 0});
      }
    })
   }

 Handler.subscribeUser = function(req,res){

 	var data = {account: req.username, subsaiddit: req.params.subsaiddit}
 	console.log(data);
 	database.getConnection().query("SELECT account,subsaiddit FROM subscriptions WHERE account='"+data.account+"' and subsaiddit='"+data.subsaiddit+"'",function(error,results,fields){
	 	if (error){
	      console.log(error);
	    } else {
	      console.log(results.length);
	      if (results.length > 0){
	      	return res.send("Already Subscribed");
	      } else {
			database.getConnection().query("INSERT INTO subscriptions SET ?",data, function(error,results,fields){
			    if (error){
			      console.log(error);
			    } else {
			      //console.log(results);
			    }
			})
	      }
	    }
 	})
 }
  Handler.unsubscribeUser = function(req,res){

  	var data = {account: req.username, subsaiddit: req.params.subsaiddit}
  	console.log(data);
  	database.getConnection().query("DELETE FROM subscriptions WHERE account='"+data.account+"' and subsaiddit='"+data.subsaiddit+"'",function(error,results,fields){
 	 	if (error){
 	      console.log(error);
 	    } else {
 	      console.log(results.length);
 	      return res.send("Successfully Unsubscribed");
 	    }
  	})
  }

Handler.getUser = function(req,res,next){
	var query = database.getConnection().query("SELECT username FROM accounts WHERE ID=?",req.accountID, function(error,results,fields){
	if (error){
      console.log(error);
    } else {
      //console.log(results);
      console.log(results[0].username);
      req.username = results[0].username;
      return next();
    }
	})
}

Handler.getPostContent = function (req,res){
  data = {subsaiddit : req.params.subsaiddit, title : req.params.post_title.replace("_"," ")}
  //console.log(data);
  database.getConnection().query("SELECT id,text,rating FROM posts,post_ratings WHERE (posts.subsaiddit=? and title=?) and (id = post_ratings.post)",[data.subsaiddit,data.title],function(error,results,fields){
    if (error){
        console.log(error);
      } else {
        console.log(results);
        if (results.length == 0){
          database.getConnection().query("SELECT text FROM posts WHERE (posts.subsaiddit=? and title=?)",[data.subsaiddit,data.title],function(error,results){
            if (error){
              console.log(error);
            } else {
              res.send(results);
            }
          })
        }else {
          res.send(results);
        }
        //console.log(results);

      }
  })
}

  Handler.sendFriends = function (req,res) {
    var friends = [];
    database.getConnection().query("SELECT account1,account2 FROM friends WHERE account1 = ? OR account2 = ?",[req.username, req.username], function(error,results,fields){
      if (error){
        console.log(error);
      } else {
        for(var i = 0; i < results.length; i++) {
          if(results[i].account1 == req.username) {
            friends.push(results[i].account2);
          } else {
            friends.push(results[i].account1);
          }
        }
        res.send(friends);
      }
    })
  }

  Handler.addFriend = function (req, res) {

    database.getConnection().query("SELECT 1 FROM friends WHERE (account1 = ? AND account2 = ?) OR (account1 = ? AND account2 = ?)",[req.username, req.body.friend, req.body.friend, req.username], function(error,results,fields){
      if (error){
        console.log(error);
      } else {
        if(results.length == 0) {
          database.getConnection().query("INSERT INTO friends VALUES (?, ?)", [req.username, req.body.friend], function(error, results, fields) {
            if(error) {
              console.log(error);
            }
            console.log("Added friend between " + req.username + " and " + req.body.friend);
            res.send("Added as friends");
          })
        } else {
          res.send("Already friends");
        }
      }
    })
  }



return Handler;
})();

module.exports = Handler;
