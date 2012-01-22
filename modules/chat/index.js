var models = require('./models')
	, views = require('./views');

app.reversible.get('/', 'home', views.home);
app.reversible.post('/rooms/create/', 'rooms:create', views.roomsCreate);
app.reversible.get('/rooms/:roomId/', 'rooms:detail', views.roomsDetail);
