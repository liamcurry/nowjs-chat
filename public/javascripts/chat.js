(function() {
  var $messages;

  $messages = $('#messages');

  $(function() {
    return now.ready(function() {
      now.receiveMessage = function(name, message, type) {
        switch (type) {
          case 'joined':
            return $messages.append("<li class='message-joined'>" + name + " joined the room</li>");
          case 'left':
            return $messages.append("<li class='message-left'>" + name + " left the room</li>");
          default:
            return $messages.append("<li class='message-msg'>" + name + ": " + message + "</li>");
        }
      };
      $('#enter-room').submit(function(e) {
        e.preventDefault();
        now.name = $('#name').val();
        now.enterRoom(now.name);
        $(this).hide();
        return $('#chat-room').show();
      });
      $('#send-message').submit(function(e) {
        e.preventDefault();
        return now.distributeMessage($('#text-input').val());
      });
      return now.receiveTemplate = function(template) {};
    });
  });

}).call(this);
