var models = require('./models')
	, views = require('./views');

app.reversible.get('/signup/', 'auth:signup', views.authSignup);
app.post('/signup/', views.authSignupPost);

app.reversible.get('/signin/', 'auth:signin', views.authSignin);
app.post('/signin/', views.authSigninPost);

app.reversible.get('/signout/', 'auth:signout', views.authSignout);
