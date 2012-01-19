(function(Chat) {

  Chat.Models.Message = Backbone.Model.extend({
      defaults: {
        name: 'anon'
    }
    , initialize: function() {
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
        o(this.el)
          .prop('class', 'message message-' + this.model.get('type'))
          .html(this.template(this.model.toJSON()));
        return this;
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
        this.data = o(this.el).data()
    }
    , sendMessage: function(e) {
        e.preventDefault();
        socket.emit('send message', this.textInput.val());
        this.textInput.val('');
    }
    , enterRoom: function() {
        socket.emit('enter room', {
            name: this.data.name
          , userId: this.data.userId
          , roomId: this.$('#chat-room').data('roomId')
        });
    }
    , addMessage: function(message) {
        var view = new Chat.Views.MessageView({ model: message });
        this.$('#messages').append(view.render().el);
        window.scrollTo(0, document.body.scrollHeight);
    }
  });

})(auxal.module('chat'));
