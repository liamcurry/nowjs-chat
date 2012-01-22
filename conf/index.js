var express = require('express')
	, stylus = require('stylus')
	, mongoose = require('mongoose')
	, passport = require('passport')
	, winston = require('winston')
	, middleware = require('../lib/middleware')
  , join = require('path').join
	, env = process.env.NODE_ENV || 'development'
	, root = join(__dirname, '..');

app.configure(env, require('./' + env));

app.configure(function() {
  app.db = mongoose.connect(app.set('mongo-uri'));
	app.io = require('socket.io').listen(app);
  app.logger = new winston.Logger({
      transports: [
        new winston.transports.Console()
      , new winston.transports.File({
          filename: join(root, 'logs', 'server.log')
      })
    ]
    , exceptionHandlers: [
        new winston.transports.File({
          filename: join(root, 'logs', 'exceptions.log')
      })
    ]
  });
  app.set('views', join(root, 'templates'));
  app.set('view engine', 'jade');
  app.set('view options', { layout: false });
	app.set('root', root);
  app.use(express.favicon());
  app.use(middleware.logRequests());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({
      secret: app.set('app-secret')
    , store: new (require('connect-redis')(express))
  }));
  app.use(express.csrf());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(stylus.middleware({ src: join(root, 'static') }));
  app.use(express.static(join(root, 'static')));
});

app.io.configure(function() {
	app.io.set('logger', app.logger);
	app.io.set('log level', 2);
	app.io.set('browser client minification', true);
	app.io.set('transports', ['websocket', 'flashsocket', 'xhr-polling']);
});
