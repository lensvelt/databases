var mysql = require('mysql');

exports.connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'chat'
});

// connection.connect();

// connection.query('SELECT 1 + 1 solution', function(err, rows, fields) {
//   if (err) { throw err; }
//   console.log('The Solution is: ', rows[0].solution);
// });

// connection.end();



// Create a database connection and export it from this file.
// You will need to connect with the user "root", no password,
// and to the database "chat".


