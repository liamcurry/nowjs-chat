var express = require('express')
  , stylus = require('stylus')
  , mongoose = require('mongoose')
  , passport = require('passport')
  , env = process.env.NODE_ENV || 'development';

app = express.createServer();

app.configure(env, require('./conf/' + env));

app.configure(function() {
  app.db = mongoose.connect(app.set('mongo-uri'));
  app.io = require('socket.io').listen(app);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { layout: false });
  app.set('root', __dirname);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(stylus.middleware({ src: __dirname + '/public' }));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: app.set('app-secret') }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

require('./models');
require('./routes');

app.dynamicHelpers({
    user: function(req, res) {
      return req.user;
  }
});

if (env != 'test') {
  app.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
  });
}
