(function(Chat) {

  Chat.Models.Message = Backbone.Model.extend({
      initialize: function() {
        var type = this.get('type')
          , content = this.get('content');
        if (type == 'left')
          content = 'left the room';
        else if (type == 'joined')
          content = 'joined the room';
        this.set({ content: content });
    }
  });

  Chat.Views.MessageView = Backbone.View.extend({
      el: 'li'
    , template: doT.template(o('#message-template').text())
    , render: function() {
        var cls = 'message message-' + this.model.get('type');
        if ('' + this.model.get('userId') == '' + auxal.app.user.userId)
          cls += ' message-mine';
        return o('<li></li>')
          .prop('class', cls)
          .html(this.template(this.model.toJSON()));
    }
  });

  Chat.Views.AppView = Backbone.View.extend({
      el: 'body'
    , events: {
        'submit #enter-room': 'enterRoom'
      , 'submit #send-message': 'sendMessage'
    }
    , initialize: function() {
        this.textInput = this.$('#text-input');
    }
    , sendMessage: function(e) {
        e.preventDefault();
        socket.emit('send message', this.textInput.val());
        this.textInput.val('');
    }
    , enterRoom: function() {
        socket.emit('enter room', {
            nickname: auxal.app.user.nickname
          , userId: auxal.app.user.userId
          , roomId: this.$('#chat-room').data('roomId')
        });
    }
    , addMessage: function(message) {
        var view = new Chat.Views.MessageView({ model: message });
        o('#messages').append(view.render());
        window.scrollTo(0, document.body.scrollHeight);
    }
  });

})(auxal.module('chat'));
