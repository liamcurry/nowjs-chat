function loginRequired(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect(app.reverse('auth:signin'));
}
