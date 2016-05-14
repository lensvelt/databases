var models = require('../models'); //Why does this require our models module??

//Will interface with the view (chat client) and the model (data) (Remember to use callbacks/promises!)

var messages = {
  results: [{
    username: 'bob',
    text: 'Hello err"body',
    roomname: 'lobby',
    objectId: 1
  }]
};
 
module.exports = {
  messages: {
    get: function (req, res) {
      messages.results[0].objectId = Math.floor(Math.random() * 10);
      res.status(200).send(messages);
      res.end();

    }, // a function which handles a get request for all messages

    post: function (req, res) {} // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {},
    post: function (req, res) {}
  }
};

