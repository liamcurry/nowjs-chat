/*
 * A simple module used for reversing routes. Useful for when changing
 * the URLs of routes easily.
 *
 * Example:
 * 	 app.reversible.get('/', 'home', func); // Creates a route named "home"
 *   app.reverse('home'); // Returns "/"
 */

app.reversible = {
		routes: {}
	, _method: function(method) {
			return function() {
				var args = [].slice.call(arguments, 0)
					, name = args.splice(1, 1)
					, url = args[0];
				app.reversible.routes[name] = url;
				app[method].apply(app, args);
			};
	}
};

['get', 'post', 'put', 'delete'].forEach(function(method) {
	app.reversible[method] = app.reversible._method(method);
});

app.reverse = function(name, params) {
	if (!(name in app.reversible.routes)) {
		throw new Error('"' + name + '" is not a registered route');
	} else {
		var route = app.reversible.routes[name];
		Object.keys(params || {}).forEach(function(key) {
			route = route.replace(':' + key, params[key]);
		});
		return route;
	}
};
