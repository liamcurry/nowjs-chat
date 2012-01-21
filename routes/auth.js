var passport = require('passport')
	, LocalStrategy = require('passport-local').Strategy
	,	db = app.db
  , User = db.model('User');


passport.use(new LocalStrategy({
			usernameField: 'email'
		, passwordField: 'password'
	}
	, function(email, password, done) {
			process.nextTick(function() {
				User.findOne({ email: email }, function(err, user) {
					if (err) return done(err);
					if (!user) return done(null, false);
					if (password != user.password) return done(null, false);
					return done(null, user);
				});
			});
	}
));

passport.serializeUser(function(user, done) {
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

app.get('/signup/', function(req, res) {
	res.render('register', { errors: {} });
});

app.post('/signup/', function(req, res) {
	var user = new User({
			email: req.body.email
		, password: req.body.password
		, nickname: req.body.nickname
	});
	user.save(function(err) {
		if (err) return res.render('register', { errors: err });
		req.logIn(user, function(err) {
			res.redirect('/');
		});
	});
});

app.get('/logout/', function(req, res) {
	req.logout();
	res.redirect('/');
});

app.get('/login/', function(req, res) {
	res.render('login');
});

app.post('/login/', passport.authenticate('local', {
		failureRedirect: '/login/?failed'
	, successRedirect: '/?success'
}));

function loginRequired(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect('/login/');
}
