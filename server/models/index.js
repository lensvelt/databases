var db = require('../db'); //uses our db connection module?

//Will interface with our database and the controller (use callbacks/promises for interaction with controller)
module.exports = {
  messages: {
    get: function (callback) {
      db.connection.query('SELECT m.id, m.text, r.name AS room, u.name AS user  FROM messages m INNER JOIN users u ON m.user = u.id INNER JOIN rooms r ON m.room = r.id;', function(error, rows, fields) {
        //access req data info 
        callback(error, rows);
      });

    }, // a function which produces all the messages
    post: function (req, callback) {
      // query user table to see if user exists
      db.connection.query('SELECT users.id FROM users WHERE users.name= ?', req.body.user, function(error, rows, fields) {
        //console.log('room? ', req.body.room, 'rows: ', rows);

        // if count = 1 -> user exists
        if (rows.length) {
          // query room table to see if room exists
          db.connection.query('SELECT rooms.id FROM rooms WHERE rooms.name= ?', req.body.room, function(error, rows, fields) {
            
            // if rooms exist
            if (!rows.length) {
              db.connection.query('INSERT INTO rooms name= ?', req.body.room, function(error, rows, fields) {
              });
            }
          });
        } else { 
        // else INSERT query to add user to users table
          db.connection.query('INSERT INTO users name= ?', req.body.user, function(error, rows, fields) {
          });
        }
      // INSERT query to add message to messages table with correct user & room ids
        db.connection.query('INSERT INTO messages SET text= ?, user = (SELECT id FROM users WHERE name = ?), room= (SELECT id FROM rooms WHERE name = ?)', [req.body.text, req.body.user, req.body.room], function(error, rows, fields) {
          callback(error, rows);
        });
      });
    } // a function which can be used to INSERT a message INTO the database
  },

  users: {
    // Ditto as above.
    get: function () {},
    post: function () {}
  }
};

//'INSERT INTO messages SET text= ?, user = (SELECT id FROM users WHERE name = ?), room= (SELECT id FROM rooms WHERE name = ?);', [req.body.text, req.body.user, req.body.room]