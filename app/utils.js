
config = require('../config');
crypto = require('crypto');

var ServerUtils;
ServerUtils = (function() {

  //Empty constructor
  function ServerUtils() {}

  // Generate a signed session token
  ServerUtils.generateSessionToken = function (accountId, accountName, expiresIn) {

    // 1 day expiry
    var expiry = (Math.floor(Date.now() / 1000) + config.expiryInSeconds);
    if(expiresIn != null){
      expiry = expiresIn;
    }

    // Here's the session info to sign
    var sessionInfo = (accountId + ':' + accountName +':' + expiry);

    // Create a key that's a conjunction of the private key and the data
    var key = (config.secret + '//' + accountId + '//' + accountName + '//' + expiry);

    // Sign it
    var hmac = crypto.createHmac('sha1', key);
    hmac.setEncoding('hex');
    hmac.write(sessionInfo);
    hmac.end();

    return(sessionInfo + ':' + hmac.read());
  }

  // Verify a signed session token is valid and unmodified
  ServerUtils.verifySessionToken = function (token, callback) {
    if(token == null) {
      return callback("Invalid Token");
    }
    var fields = token.split(':');
    if(fields.length != 4) {
      return callback("Invalid Token");
    }

    var accountId = fields[0];
    var accountName = fields[1];
    var expiry = fields[2];
    var hmacSignature = fields[3];

    var accountId = parseInt(accountId);
    var expiry = parseInt(expiry);

    // Has this token expired?
    if(expiry < Math.floor(Date.now() / 1000)) {
      return callback("Token has expired");
    }

    // Does the signature match?
    if(ServerUtils.generateSessionToken(accountId, accountName, expiry) != token) {
      return callback("Token has been modified");
    }
    //console.log(accountId);
    return callback(null, accountId, accountName, expiry);
  }

  // Cookies for authentification
  ServerUtils.setCookie = function(res, token){
    return res.cookie(config.cookieName, token,
      {
        secure: false,
        httpOnly: config.httpOnly,
        maxAge: config.expiryInSeconds * 1000
      }
    );
  }

  // Clear the cookie logging the user out effectively
  ServerUtils.clearCookie = function(res){
    return res.clearCookie(config.cookieName,
      {
        secure: config.secure,
        httpOnly: config.httpOnly
      }
    );
  }

  // Safely extract the data from the request
  ServerUtils.safeParse = function(data) {
    try {
      if (!data) {
        return {};
      }
      return JSON.parse(data);
    } catch (_error) {
      return {};
    }
  }

  // Generate a token
  ServerUtils.generateToken = function(callback){
    var rand = function() {
      return Math.random().toString(36).substr(2); // Only take the decimal as a base 32 number
    };
    return callback( Date.now() + '_' + rand() + rand() + rand() + rand() + rand() + rand());
  }

  // Note: This regex is not perfect, nor will it accept every email. Format:
  // [#@#.#]
  ServerUtils.validateEmail = function(email){
    var re = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]+/
    return re.test(email);
  }

  return ServerUtils;

})();

module.exports = ServerUtils;
