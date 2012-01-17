var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
  name: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['msg', 'joined', 'left']
  },
  content: String
});
