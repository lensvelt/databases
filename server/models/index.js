var db = require('../db'); //uses our db connection module?

//Will interface with our database and the controller (use callbacks/promises for interaction with controller)
module.exports = {
  messages: {
    get: function (callback) {
      db.connection.query('select m.id, m.text, r.name AS room, u.name AS user  FROM messages m inner join users u on m.user = u.id inner join rooms r on m.room = r.id;', function(error, rows, fields) {
        //access req data info 
        console.log('rows in GET: ', rows, 'error: ', error);
        callback(error, rows);
      });

    }, // a function which produces all the messages
    post: function (req, callback) {
      console.log('req.body all: ', req.body);
      // query user table to see if user exists
      console.log('user? ', req.body.user);
      db.connection.query('SELECT users.id FROM users WHERE users.name= ?', req.body.user, function(error, rows, fields) {
        console.log('rows in select user.id: ', rows, 'error1: ', error);
        //console.log('room? ', req.body.room, 'rows: ', rows);

        // if count = 1 -> user exists
        if (rows.length) {
          // query room table to see if room exists
          db.connection.query('SELECT rooms.id FROM rooms WHERE rooms.name= ?', req.body.room, function(error, rows, fields) {
            console.log('rows in select room.id: ', rows, 'error2: ', error);
            
            // if rooms exist
            if (!rows.length) {
              db.connection.query('insert into rooms name= ?', req.body.room, function(error, rows, fields) {
                console.log('rows in insert into rooms: ', rows, 'error2: ', error);
              });
            }
          });
        } else { 
        // else insert query to add user to users table
          db.connection.query('insert into users name= ?', req.body.user, function(error, rows, fields) {
            console.log('rows in insert into users: ', rows, 'error2: ', error);
          });
        }
      // insert query to add message to messages table with correct user & room ids
        db.connection.query('insert into messages SET text= ?, user = (select id from users where name = ?), room= (select id from rooms where name = ?)', [req.body.text, req.body.user, req.body.room], function(error, rows, fields) {
          console.log('rows in insert into messages: ', rows, 'error2: ', error);
          callback(error, rows);
        });
      });
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function () {},
    post: function () {}
  }
};

//'insert into messages SET text= ?, user = (select id from users where name = ?), room= (select id from rooms where name = ?);', [req.body.text, req.body.user, req.body.room]