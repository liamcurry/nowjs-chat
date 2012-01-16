(function() {
  var app, everyone, express, fs, nowjs, path, routes;

  fs = require('fs');

  path = require('path');

  express = require('express');

  nowjs = require('now');

  routes = require('./routes');

  app = module.exports = express.createServer();

  app.configure(function() {
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
    return app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });

  'app.configure \'development\', ->\n  app.use express.errorHandler\n    dumpExceptions: true\n    showStack: true\n\napp.configure \'production\', ->\n  app.use express.errorHandler()';

  app.get('/', routes.index);

  everyone = nowjs.initialize(app);

  everyone.now.enterRoom = function(name) {
    return everyone.now.receiveMessage(name, '', 'joined');
  };

  everyone.now.distributeMessage = function(message) {
    return everyone.now.receiveMessage(this.now.name, message, 'msg');
  };

  everyone.now.fetchTemplate = function(template) {
    var _this = this;
    return fs.readFile(path.join(app.settings.views, path.normalize(template)), function(err, data) {
      if (err) {
        throw err;
      } else {
        return _this.now.receiveTemplate(data.toString('ascii'));
      }
    });
  };

  nowjs.on('disconnect', function() {
    return nowjs.getClient(this.user.clientId, function() {
      return everyone.now.receiveMessage(this.now.name, '', 'left');
    });
  });

  app.listen(process.env.PORT || 3000, function() {
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
    console.log(process.version);
    return console.log("AWWW YEAHHHHHH");
  });

}).call(this);
