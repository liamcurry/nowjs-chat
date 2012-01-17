var path = require('path')
  , fs = require('fs')
  , nowjs = require('now')
  , everyone = nowjs.initialize(app)
  , path = require('path');

app.get('/', function(req, res) {
  res.render('index', {
    title: 'Express'
  });
});

everyone.now.enterRoom = function(name) {
  everyone.now.receiveMessage(name, '', 'joined');
};

everyone.now.distributeMessage = function(message) {
  everyone.now.receiveMessage(this.now.name, message, 'msg');
};

everyone.now.fetchTemplate = function(template) {
  var _this = this
    , templatePath = path.join(app.settings.views, path.normalize(template));
  fs.readFile(templatePath, function(err, data) {
    if (err)
      throw err;
    else
      _this.now.receiveTemplate(data.toString('ascii'));
  });
};

nowjs.on('disconnect', function() {
  nowjs.getClient(this.user.clientId, function() {
    everyone.now.receiveMessage(this.now.name, '', 'left');
  });
});
