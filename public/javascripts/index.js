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
    , Chat = auxal.module('chat')
    , bodyData = o('body').data();

  auxal.app.user = {
      nickname: bodyData.nickname
    , userId: bodyData.userId
  }

  app.chatView = new Chat.Views.AppView();

  app.chatView.enterRoom();

  socket.on('new message', function(message) {
    app.chatView.addMessage(new Chat.Models.Message(message));
  });

});
