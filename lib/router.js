app.reversible = {
		routes: {}
	, _method: function(method) {
			return function(url, name, func) {
				app.reversible.routes[name] = url;
				app[method](url, func);
			};
	}
};

['get', 'post', 'put', 'delete'].forEach(function(method) {
	app.reversible[method] = app.reversible._method(method);
});

app.reverse = function(name, params) {
	if (!(name in app.reversible.routes)) {
		//console.log(name);
		//console.log(params);
		//throw new Error('"' + name.toString() + '" is not a registered route');
	} else {
		var route = app.reversible.routes[name];
		Object.keys(params || {}).forEach(function(key) {
			route = route.replace(':' + key, params[key]);
		});
		return route;
	}
};
