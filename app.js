var express = require('express')
  , fs = require('fs')
  , join = require('path').join;

app = express.createServer();

require('./conf');
require('./lib/router');
require('./modules/auth');
require('./modules/chat');

app.helpers({
    reverse: app.reverse
  , marked: require('marked')
});

app.dynamicHelpers({
    user: function(req, res) {
      return req.user;
  }
  , csrf: function(req, res) {
      return req.session._csrf;
  }
  , messages: function(req, res) {
      return req.flash();
  }
});

if (!module.parent) {
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
