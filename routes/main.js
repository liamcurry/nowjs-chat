var path = require('path')
  , fs = require('fs')
  , path = require('path')
  , marked = require('marked');

var db = app.db
  , io = app.io
  , Room = db.model('Room');

function loginRequired(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect('/login/');
}

app.get('/', function(req, res, next) {
  Room.find({}, function(err, rooms) {
    if (err) throw err;
    res.render('index', { rooms: rooms });
  });
});

app.post('/rooms/create/', loginRequired, function(req, res, next) {
  var room = new Room({
      name: req.param('name')
    , ownerId: req.user._id
  });  

  room.save(function(err) {
    if (err) {
      res.render('roomCreate', { errors: err });
    } else {
      res.redirect('/rooms/' + room._id + '/');
    }
  });

});

app.get('/rooms/:roomId/', loginRequired, function(req, res, next) {
  Room.findById(req.params.roomId, function(err, room) {
    res.render('roomDetail', { room: room });
  });
});

io.sockets.on('connection', function(socket) {

  socket.on('enter room', function(info) {
    socket.join(info.roomId);
    socket.set('info', info);
    Room.findById(info.roomId, function(err2, room) {
      var message = {
            timestamp: Date.now()
          , nickname: info.nickname
          , userId: info.userId
          , content: ''
          , type: 'joined'
        };
      room.messages.push(message);
      io.sockets.in(info.roomId).emit('new message', message);
      room.save()
    });
  });

  socket.on('send message', function(content) {
    socket.get('info', function(err1, info) {
      Room.findById(info.roomId, function(err2, room) {
        var message = {
            timestamp: Date.now()
          , nickname: info.nickname
          , userId: info.userId
          , content: content
          , type: 'msg'
        };
        room.messages.push(message);
        message.content = marked(message.content);
        io.sockets.in(info.roomId).emit('new message', message);
        room.save();
      });
    });
  });

  socket.on('disconnect', function() {
    socket.get('info', function(err1, info) {
      if (info == null) return;
      Room.findById(info.roomId, function(err2, room) {
        var message = {
            timestamp: Date.now()
          , nickname: info.nickname
          , userId: info.userId
          , content: ''
          , type: 'left'
        };
        room.messages.push(message);
        io.sockets.in(info.roomId).emit('new message', message);
        room.save();
      });
    });
  });

});
