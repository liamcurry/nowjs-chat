var db = app.db;

var UserSchema = new db.Schema({
		email: {
			type: String
		, unique: true
	}
	, nickname: String
	, password: String // Will encrypt this later
}, { strict: true });



db.model('User', UserSchema);
