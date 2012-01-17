o = $;

var socket = io.connect()
  , messages = o('#messages')
  , messageInput = o('#text-input')
  , messageTemplate = doT.template(o('#message-template').text());

o(function() {

  socket.on('new message', function(message) {
    if (message.type == 'left')
      message.content = 'left the room';
    else if (message.type == 'joined')
      message.content = 'joined the room';
    messages.append(messageTemplate(message));
  });

  o('#enter-room').submit(function(e) {
    e.preventDefault();
    socket.emit('set name', o('#name').val());
    o(this).hide();
    o('#chat-room').show();
  });

  o('#send-message').submit(function(e) {
    e.preventDefault();
    socket.emit('send message', o('#text-input').val());
  });

});
