var express = require('express')
  , stylus = require('stylus');

app = express.createServer();

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('root', __dirname);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(stylus.middleware({ src: __dirname + '/public' }));
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function() {
  app.use(express.errorHandler());
});

require('./routes');

app.listen(process.env.PORT || 3000, function () {
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
