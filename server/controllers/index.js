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
var id = 1;
 
module.exports = {
  messages: {
    get: function (req, res) {
      // console.log('get models: ', models.messages.get());
      res.status(200).send(messages);
      res.end();

    }, // a function which handles a get request for all messages

    post: function (req, res) {
      req.body.objectId = id++;
      messages.results.push(req.body);

      res.status(200); //.send(messages.results[messages.results.length - 2].objectId);
      res.end();
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {},
    post: function (req, res) {}
  }
};

