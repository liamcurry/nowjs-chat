var path = require('path')
  , fs = require('fs')
  , path = require('path');

var db = app.db
  , io = app.io
  , Message = db.model('Message');

app.get('/', function(req, res, next) {
  Message.find({}, function(err, messages) {
    res.render('index', { messages: messages });
  });
});

io.sockets.on('connection', function(socket) {

  socket.on('set name', function(name) {
    var message = { timestamp: Date.now(), name: name, content: '', type: 'joined' }
      , instance = new Message(message);
    socket.set('name', name);
    io.sockets.emit('new message', message);
    instance.save();
  });

  socket.on('send message', function(content) {

    socket.get('name', function(err, name) {
      var message = { timestamp: Date.now(), name: name, content: content, type: 'msg' }
        , instance = new Message(message);
      io.sockets.emit('new message', message);
      instance.save();
    });

  });

  socket.on('disconnect', function() {
    socket.get('name', function(err, name) {
      var message = { timestamp: Date.now(), name: name, content: '', type: 'left' }
        , instance = new Message(message);
      io.sockets.emit('new message', message);
      instance.save();
    });
  });

});
