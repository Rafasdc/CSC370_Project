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
	var query = database.getConnection().query("SELECT title,SUM(rating) AS 'rating',url FROM posts LEFT JOIN post_ratings ON posts.id = post_ratings.post WHERE subsaiddit=? GROUP BY title,rating,url ORDER BY rating DESC",req.params.subsaiddit, function(error,results,fields){
    if (error){
      console.log(error);
    } else {
      //console.log(results);
      res.send(results);
    }
  })
}


  Handler.sendSubscribed = function (req,res){
  	var query = database.getConnection().query("SELECT subsaiddit FROM subscriptions WHERE account= ?",req.username, function(error,results,fields){
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
   	var query = database.getConnection().query("SELECT subsaiddit FROM subscriptions WHERE account= ? AND subsaiddit = ?",[req.username, req.params.subsaiddit], function(error,results,fields){
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

Handler.getPostContent = function (req,res){
  data = {subsaiddit : req.params.subsaiddit, title : req.params.post_title.replace("_"," ")}
  //console.log(data);
  database.getConnection().query("SELECT id,text FROM posts WHERE subsaiddit=? and title=?",[data.subsaiddit,data.title],function(error,results,fields){
    if (error){
        console.log(error);
      } else {
        console.log(results);
        if (results.length == 0){
          res.send("Post not found");
        }else {
          var post_data = {id: results[0].id, text: results[0].text};
          var total = 0;
          database.getConnection().query("SELECT rating FROM post_ratings WHERE post = ?", [results[0].id], function(error, results, fields) {
            if(error) {
              console.log(error);
            }
            for(var i = 0; i < results.length; i++) {
              total += parseInt(results[i].rating);
            }
            post_data.rating = total;
            res.send(post_data);
          });
        }
        //console.log(results);
      }
  })
}

  Handler.sendFriends = function (req,res) {
    var friends = [];
    database.getConnection().query("SELECT account2 FROM friends WHERE account1 = ?",[req.username], function(error,results,fields){
      if (error){
        console.log(error);
      } else {
        for(var i = 0; i < results.length; i++) {
          friends.push(results[i].account2);
        }
        res.send(friends);
      }
    })
  }

  Handler.addFriend = function (req, res) {
    if(req.username == req.body.friend) {
      res.send("Cannot be friends with yourself");
      return;
    }
    database.getConnection().query("SELECT 1 FROM accounts WHERE username = ?", [req.body.friend], function(error, results, fields) {
      if(results.length == 0) {
        res.send("User not found.");
      } else {
        var account1 = req.username;
        var account2 = req.body.friend;
        if(account1 > account2) {
          account1 = req.body.friend;
          account2 = req.username;
        }
        database.getConnection().query("SELECT 1 FROM friends WHERE account1 = ? AND account2 = ?",[account1, account2], function(error,results,fields){
          if (error){
            console.log(error);
          } else {
            if(results.length == 0) {
              console.log("Added friend between " + req.username + " and " + req.body.friend);
              database.getConnection().query("INSERT INTO friends VALUES (?, ?)", [account1, account2], function(error, results, fields) {
                if(error) {
                  console.log(error);
                }
              })
              database.getConnection().query("INSERT INTO friends VALUES (?, ?)", [account2, account1], function(error, results, fields) {
                if(error) {
                  console.log(error);
                }
              })
              res.send("success");
            } else {
              res.send("Already friends");
            }
          }
        })
      }
    });
  }

  Handler.getAddPost = function (req, res){
    var query= database.getConnection().query("SELECT title FROM subsaiddits WHERE title=?",req.params.subsaiddit,function(error,results,fields){
    if (error){
        console.log(error);
      } else {
          if (results.length == 0){
            res.status(404).send("Subsaiddit Does not Exist");
          } else {
            return res.sendFile('/public/create_post.html',{root: "."}); //. = directory where server.js is
          }
      }
  })
  }

  Handler.insertPost = function(req, res){
    console.log(req.body);
    console.log(req.username);
    var post = {
        title: req.body.title,
        url: req.body.url,
        time_published: new Date().toISOString().substring(0, 19).replace('T', ' '),
        text: req.body.text,
        subsaiddit: req.body.subsaiddit,
        poster: req.username
      }
    //console.log(req.accuntID);
    var query = database.getConnection().query("INSERT INTO posts SET ? ", post, function(error, results){
      if(error){
        console.log(error);
      } else {
        res.status(200).send("Post Created");
      }
    })


  }

  Handler.getUsersPosts = function (req, res){
    var query = database.getConnection().query("SELECT title,SUM(rating) AS 'rating',url,id FROM posts LEFT JOIN post_ratings ON posts.id = post_ratings.post WHERE poster=? GROUP BY title,rating,url,id",req.username,function(error,results){
      if(error){
        console.log(error);
      } else {
        for(var i = 0; i < results.length; i++) {
          if(!results[i].rating) {
            results[i].rating = 0;
          }
        }
        console.log(results);
        res.send(results);
      }
    })
  }

  Handler.deletePost = function(req,res){
    var query = database.getConnection().query("DELETE FROM posts WHERE id=? and poster=?",[req.body.id, req.username], function(error,results){
      if(error){
        console.log(error);
        res.status(400).send("Erro deleting post");
      } else {
        res.status(200).send("Post deleted");
      }
    })
  }


  Handler.vote = function(req, res) {
    data = {subsaiddit : req.params.subsaiddit, title : req.params.post.replace("_"," ")}
    database.getConnection().query("SELECT id FROM posts WHERE title = ?", [data.title], function(error, results, fields) {
      if(error) {
        console.log(error);
      }
      if(results.length == 0) {
        res.send("post not found");
      } else {
        var postId = results[0].id;
        database.getConnection().query("SELECT rating FROM post_ratings WHERE account = ? AND post = ?", [req.username, postId], function(error, results,fields) {
          if(results.length == 0) {
            database.getConnection().query("INSERT INTO post_ratings (account, post, rating) VALUES (?, ?, ?)", [req.username, postId, req.body.rating], function(error, results, fields) {
              if(error) {
                console.log(error);
                res.send(error);
              } else {
                res.send("success");
              }
            })
          } else {
            database.getConnection().query("UPDATE post_ratings SET rating = ? WHERE account = ? AND post = ?", [req.body.rating, req.username, postId], function(error, results, fields) {
              if(error) {
                console.log(error);
                res.send(error);
              } else {
                res.send("success");
              }
            })
          }
        })
      }
    })
  }

  Handler.getRating = function(req, res) {
    data = {subsaiddit : req.params.subsaiddit, title : req.params.post.replace("_"," ")}
    database.getConnection().query("SELECT id FROM posts WHERE title = ?", [data.title], function(error, results, fields) {
      if(results.length == 0) {
        res.send("post not found");
      } else {
        var postId = results[0].id;
        var total = 0;
        database.getConnection().query("SELECT rating FROM post_ratings WHERE post = ?", [postId], function(error, results, fields) {
          if(error) {
            console.log(error);
          }
          for(var i = 0; i < results.length; i++) {
            total += parseInt(results[i].rating);
          }
          res.send({rating: total});
        })
      }
    })
  }



return Handler;
})();

module.exports = Handler;
