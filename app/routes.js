
var config        = require('../config');

var Authenticate  = require('./authenticate');


module.exports = function(app, express) {
  var router = express.Router();

  router.post('/login', Authenticate.login);
  router.post('/logout', Authenticate.ensureLoggedIn, Authenticate.logout);
  router.post('/register', Authenticate.register);
  router.post('/checkLogin',Authenticate.ensureLoggedIn);
  //get a subsaiddit front page
  //router.get('/s/:subsaiddit',)
  //get a post from a subsaiddit
  //router.get('/s/:subsaidditTitle/:post')

  return router;
};
