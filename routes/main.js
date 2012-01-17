var path = require('path')
  , fs = require('fs')
  , path = require('path')
  , io = require('socket.io').listen(app);

var db = app.db
  , Message = db.model('Message');

app.get('/', function(req, res, next) {
  Message.find({}, function(err, messages) {
    res.render('index', { messages: messages });
  });
});

io.sockets.on('connection', function(socket) {

  socket.on('set name', function(name) {
    var instance = new Message();
    socket.set('name', name);
    io.sockets.emit('new message', {
      timestamp: Date.now(), name: name, content: '', type: 'joined'
    });
    instance.name = name;
    instance.type = 'joined';
    instance.content = '';
    instance.save();
  });

  socket.on('send message', function(message) {
    var instance = new Message();
    socket.get('name', function(err, name) {
      io.sockets.emit('new message', {
        timestamp: Date.now(), name: name, content: message, type: 'msg'
      });
      instance.name = name;
      instance.type = 'msg';
      instance.content = message;
      instance.save();
    });
  });

  socket.on('disconnect', function() {
    socket.get('name', function(err, name) {
      var instance = new Message();
      io.sockets.emit('new message', {
        timestamp: Date.now(), name: name, content: '', type: 'left'
      });
      instance.name = name;
      instance.type = 'left';
      instance.content = '';
      instance.save();
    });
  });

});
