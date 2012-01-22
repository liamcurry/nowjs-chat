var passport = require('passport')
	, LocalStrategy = require('passport-local').Strategy
	, reverse = app.reverse
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

exports.authSignup = function(req, res) {
	res.render('register', { errors: {} });
};

exports.authSignupPost = function(req, res) {
	var user = new User({
			email: req.body.email
		, password: req.body.password
		, nickname: req.body.nickname
	});
	user.save(function(err) {
		if (err) return res.render('register', { errors: err });
		req.logIn(user, function(err) {
			res.redirect(reverse('home'));
		});
	});
};

exports.authSignout = function(req, res) {
	req.logout();
	res.redirect(reverse('home'));
};

exports.authSignin = function(req, res) {
	res.render('login');
};

exports.authSigninPost = function(req, res, next) {
	passport.authenticate('local', function(err, user, profile) {
		if (err) return next(err);
		if (!user) {
			return res.redirect(reverse('auth:signin'));
		} else {
			return res.redirect(reverse('home'));
		}
	});
};

function loginRequired(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect(reverse('auth:signin'));
}
