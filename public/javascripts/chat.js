o = $;

var messages = o('#messages')
  , messageInput = o('#text-input')
  , messageTemplate = doT.template(o('#message-template').text());

window.template = messageTemplate;
o(function() {
  now.receiveMessage = function(timestamp, name, content, type) {
    if (type == 'left')
      content = 'left the room';
    else if (type == 'joined')
      content = 'joined the room';
    messages.append(messageTemplate({
        timestamp: timestamp
      , name: name
      , content: content
      , type: type
    }));
  };

  o('#enter-room').submit(function(e) {
    e.preventDefault();
    now.name = o('#name').val();
    now.enterRoom(now.name);
    o(this).hide();
    o('#chat-room').show();
  });

  o('#send-message').submit(function(e) {
    e.preventDefault();
    now.distributeMessage(o('#text-input').val());
  });

});
