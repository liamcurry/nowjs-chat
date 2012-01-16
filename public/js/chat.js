(function() {

  $(function() {
    now.receiveMessage = function(name, message) {
      return $('#messages').append("<li>" + name + ": " + message + "</li>");
    };
    $('#send-button').click(function() {
      return now.distributeMessage($('#text-input').val());
    });
    $('#text-input').val('');
    now.name = prompt('What is your name?');
    return now.receiveTemplate = function(template) {
      return console.log(template);
    };
  });

}).call(this);
