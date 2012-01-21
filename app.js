var express = require('express')
  , stylus = require('stylus')
  , mongoose = require('mongoose')
  , passport = require('passport')
  , RedisStore = require('connect-redis')(express)
  , marked = require('marked')
  , env = process.env.NODE_ENV || 'development';

app = express.createServer();

app.configure(env, require('./conf/' + env));

app.configure(function() {
  app.db = mongoose.connect(app.set('mongo-uri'));
  app.io = require('socket.io').listen(app);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { layout: false });
  app.use(express.favicon());
  app.use(express.logger('dev'));
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
  app.use(stylus.middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

require('./models');
require('./routes');

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

if (env != 'test') {
  app.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
  });
}
