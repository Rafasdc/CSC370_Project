
var config        = require('../config');

var Authenticate  = require('./authenticate');
var Handler = require('./handler');


module.exports = function(app, express) {
  var router = express.Router();

  router.post('/login', Authenticate.login);
  router.post('/logout', Authenticate.ensureLoggedIn, Authenticate.logout);
  router.post('/register', Authenticate.register);
  router.post('/checkLogin',Authenticate.ensureLoggedIn,Authenticate.sendLoginStatus);
  //get a subsaiddit front page
  router.get('/:subsaiddit', Handler.sendSubsaiddit);
  //get a post from a subsaiddit
  router.get('/:subsaiddit/:post', Handler.getPost);
  //add and delete posts
  //router.get('/:subsaiddit/:addPost', Handler.addPost);
  //router.get('/:subsaiddit/:deletePost',Handler.deletePost);


  return router;
};
