
var app = {

  //TODO: The current 'toggleFriend' function just toggles the class 'friend'
  //to all messages sent by the user
  server: 'http://127.0.0.1:3000/classes/messages',
  user: 'anonymous',
  room: 'lobby',
  lastMessageId: 0,
  friends: {},

  init: function() {
    // Get user
    app.user = window.location.search.substr(10) || 'fred';

    // Cache jQuery selectors
    app.$message = $('#message');
    app.$chats = $('#chats');
    app.$roomSelect = $('#roomSelect');
    app.$send = $('#send');

    // Add listeners
    app.$chats.on('click', '.user', app.toggleFriend);
    app.$send.on('submit', app.handleSubmit);
    app.$roomSelect.on('change', app.saveRoom);

    // Fetch previous messages
    app.startSpinner();
    app.fetch(false);

    // Poll for new messages
    setInterval(app.fetch, 5000);
  },

  send: function(data) {
    app.startSpinner();
    // Clear messages input
    app.$message.val('');

    // POST the message to the server
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function (data) {
        // Trigger a fetch to update the messages, pass true to animate
        app.fetch();
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  fetch: function(animate) {
    $.ajax({
      url: app.server,
      type: 'GET',
      contentType: 'application/json',
      data: { order: '-createdAt'},
      success: function(data) {
        console.log('from client: ', data);
        // Don't bother if we have nothing to work with
        if (!data || !data.length) { return; }

        // Get the last message
        var mostRecentMessage = data[data.length - 1];
        var displayedRoom = $('.chat span').first().data('room');
        app.stopSpinner();
        // Only bother updating the DOM if we have a new message
        if (mostRecentMessage.id !== app.lastMessageId || app.room !== displayedRoom) {
          // Update the UI with the fetched rooms
          app.populateRooms(data);

          // Update the UI with the fetched messages
          app.populateMessages(data, animate);

          // Store the ID of the most recent message
          app.lastMessageId = mostRecentMessage.id;
        }
      },
      error: function(data) {
        console.error('chatterbox: Failed to fetch messages');
      }
    });
  },

  clearMessages: function() {
    app.$chats.html('');
  },

  populateMessages: function(results, animate) {
    // Clear existing messages

    app.clearMessages();
    app.stopSpinner();
    if (Array.isArray(results)) {
      // Add all fetched messages
      results.forEach(app.addMessage);
    }

    // Make it scroll to the bottom
    var scrollTop = app.$chats.prop('scrollHeight');
    if (animate) {
      app.$chats.animate({
        scrollTop: scrollTop
      });
    } else {
      app.$chats.scrollTop(scrollTop);
    }
  },

  populateRooms: function(results) {
    app.$roomSelect.html('<option value="__newRoom">New room...</option><option value="" selected>Lobby</option></select>');

    if (results) {
      var rooms = {};
      results.forEach(function(data) {
        var room = data.room;
        if (room && !rooms[room]) {
          // Add the room to the select menu
          app.addRoom(room);

          // Store that we've added this room already
          rooms[room] = true;
        }
      });
    }

    // Select the menu option
    app.$roomSelect.val(app.room);
  },

  addRoom: function(room) {
    // Prevent XSS by escaping with DOM methods
    var $option = $('<option/>').val(room).text(room);

    // Add to select
    app.$roomSelect.append($option);
  },

  addMessage: function(data) {
    if (!data.room) {
      data.room = 'lobby';
    }

    // Only add messages that are in our current room
    if (data.room === app.room) {
      // Create a div to hold the chats
      var $chat = $('<div class="chat"/>');

      // Add in the message data using DOM methods to avoid XSS
      // Store the user in the element's data
      var $user = $('<span class="user"/>');
      $user.text(data.user + ': ').attr('data-user', data.user).attr('data-room', data.room).appendTo($chat);

      // Add the friend class
      if (app.friends[data.user] === true) {
        $user.addClass('friend');
      }

      var $message = $('<br><span/>');
      $message.text(data.text).appendTo($chat);

      // Add the message to the UI
      app.$chats.append($chat);
    }
  },

  toggleFriend: function(evt) {
    var user = $(evt.currentTarget).attr('data-user');

    if (user !== undefined) {
      // Store as a friend
      app.friends[user] = true;

      // Bold all previous messages
      // Escape the user in case it contains a quote
      var selector = '[data-user="' + user.replace(/"/g, '\\\"') + '"]';
      var $usernames = $(selector).toggleClass('friend');
    }
  },

  saveRoom: function(evt) {

    var selectIndex = app.$roomSelect.prop('selectedIndex');
    // New room is always the first option
    if (selectIndex === 0) {
      var room = prompt('Enter room name');
      if (room) {
        // Set as the current room
        app.room = room;

        // Add the room to the menu
        app.addRoom(room);

        // Select the menu option
        app.$roomSelect.val(room);

        // Fetch messages again
        app.fetch();
      }
    } else {
      app.startSpinner();
      // Store as undefined for empty names
      app.room = app.$roomSelect.val();

      // Fetch messages again
      app.fetch();
    }
  },

  handleSubmit: function(evt) {
    var message = {
      user: app.user,
      text: app.$message.val(),
      room: app.room || 'lobby'
    };

    app.send(message);

    // Stop the form from submitting
    evt.preventDefault();
  },

  startSpinner: function() {
    $('.spinner img').show();
    $('form input[type=submit]').attr('disabled', 'true');
  },

  stopSpinner: function() {
    $('.spinner img').fadeOut('fast');
    $('form input[type=submit]').attr('disabled', null);
  }
};

