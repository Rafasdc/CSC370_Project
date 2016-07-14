
var config = require('../config');
var mysql      = require('mysql');

var DatabaseConnection;
DatabaseConnection = (function() {

  var connection;
  //Empty constructor
  function DatabaseConnection() {}

  DatabaseConnection.connect = function(info) {

    connection = mysql.createConnection(info);

    connection.connect(function(err) {
      if (err) {
        console.error('error connecting: ' + err.stack);
        return;
      }
      console.log('connected to SQL as id ' + connection.threadId);
    });
  }

  DatabaseConnection.getConnection = function() {
    return connection;
  }

  return DatabaseConnection;

})();

module.exports = DatabaseConnection;
