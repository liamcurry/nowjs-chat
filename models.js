(function() {
  var MessageSchema, mongoose;

  mongoose = require('mongoose');

  MessageSchema = new mongoose.Schema({
    name: String,
    timestamp: {
      type: Date,
      "default": Date.now
    },
    type: {
      type: String,
      "enum": ['msg', 'joined', 'left']
    },
    content: String
  });

}).call(this);
