var db = app.db;

db.model('Message', new db.Schema({
    name: String
  , timestamp: {
      type: Date
    , default: Date.now
  }
  , type: {
      type: String
    , enum: ['msg', 'joined', 'left']
  }
  , content: String
}));
