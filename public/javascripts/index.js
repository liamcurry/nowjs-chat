o = $;

socket = io.connect()

auxal = {
    module: function() {
      var modules = {};

      return function(name) {
        if (modules[name])
          return modules[name];
        return modules[name] = { Views: {}, Models: {}, Collections: {} };
      };
  }()
  , app: _.extend({}, Backbone.Events)
};

o(function() {

  var app = auxal.app
    , Chat = auxal.module('chat');

  app.chatView = new Chat.Views.AppView();

  socket.on('new message', function(message) {
    app.chatView.addMessage(new Chat.Models.Message(message));
  });

});