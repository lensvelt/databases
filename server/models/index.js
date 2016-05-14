var db = require('../db'); //uses our db connection module?

//Will interface with our database and the controller (use callbacks/promises for interaction with controller)
module.exports = {
  messages: {
    get: function (callback) {
      db.connection.connect();
      db.connection.query({
        sql: 'SELECT * FROM messages',
        timeout: 40000
      }, function(error, rows, fields) {
        console.log('rows: ', rows, 'error: ', error);
      });
      db.connection.end();

    }, // a function which produces all the messages
    post: function () {} // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function () {},
    post: function () {}
  }
};

