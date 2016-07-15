
var bcrypt       = require('bcrypt-nodejs');
var config       = require('../config');
var utils        = require('./utils');
var database     = require('./database');



var Authenticate;
Authenticate = (function() {

  //Empty constructor
  function Authenticate() {}

  // Middleware - ensure user is logged out
  Authenticate.ensureLoggedOut = function(req, res, next) {
    if(req.cookies == null){
      return next();
    }
    if (req.cookies[config.cookieName] == null) {
      return next();
    } else {
      return res.status(400).send({
        error: "You must be logged out to do this action"
      });
    }
  }

  // Middleware - ensure user is logged in
  Authenticate.ensureLoggedIn = function(req, res, next) {
    console.log(req.cookies);
    if(req.cookies != null){
      if (req.cookies[config.cookieName] != null) {
        return utils.verifySessionToken(req.cookies[config.cookieName], function(err,accountID,expiry) {
          if (err)
          {
            utils.clearCookie(res);
            return res.status(400).send({error: err});
          }
          else
          {
            req.accountID = accountID;
            return next();
          }
        });
      }
    }
    return res.status(401).send();
  }


  // API Call
  Authenticate.login = function(req, res) {
    var body = req.body;
    login(body, function(err, sessionToken, account) {
      if(err) {
        utils.clearCookie(res);
        console.log(err);
        return res.status(400).send({error: err});
      }
      else
      {
        utils.setCookie(res, sessionToken);
        return res.status(200).send(account);
      }
    })
  }

  // API Call
  Authenticate.logout = function(req, res) {
    utils.clearCookie(res);
    return res.status(200).send();
  }

  // API Call
  Authenticate.register = function(req, res) {
    body = req.body;
    register(body, function(error, sessionToken, results) {
      // Handle error
      if (error) {
        return res.status(400).send({
          error: error
        });
      }
      //Handle success
      utils.setCookie(res, sessionToken);
      res.status(200).send(JSON.stringify(results));
    });
  }

  Authenticate.sendLoginStatus = function(req, res){
    console.log("USER IS LOGGED IN");
    console.log(req.accountID);
    getLoggedUser(req.accountID, function(err,user){
      if(err){
        console.log(err);
        return res.status(400).send({error: err});
      } else {
        console.log(user);
        res.status(200).send(user);
      }
    })
  }

  return Authenticate;
 })();

 login = function (data, callback) {
  console.log(data);
  if(data.username == null) {
    return callback("Must provide a username");
  }
  if(data.password == null) {
    return callback("Must provide a password");
  }

  var username = data.username;
  var password = data.password;
  var salt = 'j15t9s01md'
  //password += salt

  database.getConnection().query("SELECT password, id FROM accounts WHERE username = ?", [username], function(error, results, fields) {
    if (error){
      console.log(error);
      return callback(error);
    }
    if (results.length == 0){
      //no such user
      return callback('No user found');
    } else {
      console.log(results);
      console.log(results[0].password);
      console.log(password);
      var passed = bcrypt.compareSync(password, results[0].password);
      console.log(passed);
      if(passed != true) {
        return callback("Invalid username or password");
      }
      var token = utils.generateSessionToken(results[0].id);
      var result = {username: username, id: results[0].id};
      return callback(null, token, result);
    }
  });
}

register = function(body, callback) {
  var email = body.email.trim();
  var username = body.username.trim();
  var password = body.password.trim();

  if(email.length == 0 ||
    username.length == 0||
    password.length == 0
  ){
    return callback('Invalid arguments');
  }

  if(!utils.validateEmail(email)){
    return callback('A valid email is required!');
  }
  // bcrypt does the salting for us
  var salt = bcrypt.genSaltSync(10);
  var hashed = bcrypt.hashSync(password, salt);

  var post = {username: username, email: email, password: hashed, date_registered: new Date().toISOString().substring(0, 19).replace('T', ' ')};

  var query = database.getConnection().query('INSERT INTO accounts SET ?', post, function(err, result){
    if (err) {
      console.log(err);
      return callback(err);
    } else {
      database.getConnection().query("SELECT id FROM accounts WHERE username = ?", [username], function(err, results, fields) {
        if (err) {
          console.log(err);
          return callback(err);
        } else {
          var token = utils.generateSessionToken(results[0].id);
          return callback(null, token, post);
        }
      });
    }
  });



}


  getLoggedUser = function(accountID, callback){
    database.getConnection().query("SELECT username FROM accounts WHERE id = ?", accountID, function(error, results, fields) {
      if (error){
        console.log(error);
        return callback(error);
      } else {
        //console.log(results[0].username);
        callback(null,results[0].username)
      }
    });
  }

module.exports = Authenticate;
