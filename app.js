var express = require('express')
  , stylus = require('stylus')
  , mongoose = require('mongoose')
  , passport = require('passport')
  , RedisStore = require('connect-redis')(express)
  , marked = require('marked')
  , winston = require('winston')
  , fs = require('fs')
  , join = require('path').join
  , middleware = require('./lib/middleware')
  , env = process.env.NODE_ENV || 'development';

app = express.createServer();

app.configure(env, require('./conf/' + env));

app.configure(function() {
  app.db = mongoose.connect(app.set('mongo-uri'));
  app.io = require('socket.io').listen(app);
  app.logger = new winston.Logger({
      transports: [
        new winston.transports.Console()
      , new winston.transports.File({
          filename: join('logs', 'server.log')
      })
    ]
    , exceptionHandlers: [
        new winston.transports.File({
          filename: join('logs', 'exceptions.log')
      })
    ]
  });
  app.set('views', join(__dirname, 'templates'));
  app.set('view engine', 'jade');
  app.set('view options', { layout: false });
  app.use(express.favicon());
  app.use(middleware.logRequests());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({
      secret: app.set('app-secret')
    , store: new RedisStore
  }));
  app.use(express.csrf());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(stylus.middleware({ src: join(__dirname, 'public') }));
  app.use(express.static(join(__dirname, 'public')));
});

require('./lib/router');
require('./modules/auth');
require('./modules/chat');

app.helpers({
    reverse: app.reverse
});

app.dynamicHelpers({
    user: function(req, res) {
      return req.user;
  }
  , csrf: function(req, res) {
      return req.session._csrf;
  }
  , marked: function(req, res) {
      return function(value) {
        return marked(value);
    }
  }
});

if (!module.parent && env != 'test') {
  var pid = process.pid.toString()
    , pidfile = join('pids', 'server.pid');

  app.listen(process.env.PORT || 3000);
  app.logger.info('Environment: ' + app.settings.env);
  app.logger.info('Opening server on port: ' + app.address().port);

  fs.unlink(pidfile, function() {
    fs.writeFile(pidfile, pid, function(err) {
      if (err) throw Error('Could not make pidfile: ' + err);
    });
  });

  process.on('SIGTERM', function() {
    app.logger.info('received SIGTERM, exiting');
    process.exit();
  });

}
