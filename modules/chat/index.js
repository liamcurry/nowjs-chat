var models = require('./models')
	, views = require('./views')
	, routesMiddleware = require('../auth/routes-middleware');

app.reversible.get('/', 'home', views.home);
app.reversible.get('/rooms/create/', 'rooms:create', views.roomsCreate);
app.reversible.post('/rooms/create/', 'rooms:createPost', views.roomsCreate);
app.reversible.get('/rooms/:roomId/', 'rooms:detail', views.roomsDetail);
