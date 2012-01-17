var path = require('path')
  , fs = require('fs')
  , nowjs = require('now')
  , everyone = nowjs.initialize(app)
  , path = require('path');

var db = app.db
  , Message = db.model('Message');

app.get('/', function(req, res, next) {
  Message.find({}, function(err, messages) {
    res.render('index', { messages: messages });
  });
});

everyone.now.enterRoom = function(name) {
  var instance = new Message();
  everyone.now.receiveMessage(Date.now(), name, '', 'joined');
  instance.name = name;
  instance.type = 'joined';
  instance.content = '';
  instance.save();
};

everyone.now.distributeMessage = function(message) {
  var instance = new Message();
  everyone.now.receiveMessage(Date.now(), this.now.name, message, 'msg');
  instance.name = this.now.name;
  instance.type = 'msg';
  instance.content = message;
  instance.save();
};

nowjs.on('disconnect', function() {
  nowjs.getClient(this.user.clientId, function() {
    var instance = new Message();
    everyone.now.receiveMessage(Date.now(), this.now.name, '', 'left');
    instance.name = this.now.name;
    instance.type = 'left';
    instance.content = '';
    instance.save();
  });
});
