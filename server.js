(function() {
  var app, everyone, express, fs, path, port, routes;

  fs = require('fs');

  path = require('path');

  express = require('express');

  routes = require('./routes');

  app = module.exports = express.createServer();

  app.configure(function() {
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    return app.use(express.static(path.join(__dirname, 'public')));
  });

  app.configure('development', function() {
    return app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });

  app.configure('production', function() {
    return app.use(express.errorHandler());
  });

  app.get('/', routes.index);

  everyone = require('now').initialize(app);

  everyone.now.distributeMessage = function(message) {
    return everyone.now.receiveMessage(this.now.name, message);
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

  port = process.env.PORT || 3000;

  app.listen(port, function() {
    return console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
  });

}).call(this);
