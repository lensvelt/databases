var db = require('../db'); //uses our db connection module?

//Will interface with our database and the controller (use callbacks/promises for interaction with controller)
module.exports = {
  messages: {
    get: function (callback) {
      db.connection.query('SELECT * FROM messages inner join users on messages.user = users.name', function(error, rows, fields) {
        //access req data info 
        console.log('rows: ', rows, 'error: ', error);
        callback(error, rows);
      });

    }, // a function which produces all the messages
    post: function (req, callback) {
      console.log(req.body);
      db.connection.query('INSERT INTO messages SET ?', req.body, function(error, rows, fields) {
        console.log('rows: ', rows, 'error: ', error);
        callback(error, rows);
      });
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function () {},
    post: function () {}
  }
};

