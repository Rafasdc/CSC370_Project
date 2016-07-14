
var config        = require('../config');

var Authenticate  = require('./authenticate');


module.exports = function(app, express) {
  var router = express.Router();

  router.post('/login', Authenticate.login);
  router.post('/logout', Authenticate.ensureLoggedIn, Authenticate.logout);
  router.post('/register', Authenticate.register);

  return router;
};
