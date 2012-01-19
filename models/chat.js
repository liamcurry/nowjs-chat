var db = app.db;

var MessageSchema = new db.Schema({
	  userId: db.Schema.ObjectId
  , timestamp: {
      type: Date
    , default: Date.now
  }
  , type: {
      type: String
    , enum: ['msg', 'joined', 'left']
  }
  , content: String
}, { strict: true });

var RoomSchema = new db.Schema({
		name: String
	, ownerId: db.Schema.ObjectId
	, messages: [MessageSchema]
	, timestamp: {
			type: Date
		, default: Date.now
	}
}, { strict: true });

db.model('Room', RoomSchema);
db.model('Message', MessageSchema);
