var db = require('../db'); //uses our db connection module?

//Will interface with our database and the controller (use callbacks/promises for interaction with controller)
module.exports = {
  messages: {
    get: function (callback) {
      db.connection.query({
        sql: 'SELECT * FROM messages',
        timeout: 40000
      }, function(error, rows, fields) {
        //access req data info 
        console.log('rows: ', rows, 'error: ', error);
        callback(error, rows);
      });

    }, // a function which produces all the messages
    post: function (ca) {
      // db.connection.insert({
      //   ...
      // }, function(error rows, fields) {
      //   console.log('rows: ', rows, 'error: ', error);
      //   callback(error, rows);
      // });
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function () {},
    post: function () {}
  }
};

