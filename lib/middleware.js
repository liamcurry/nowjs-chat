var express = require('express');

exports.logRequests = function() {
	return express.logger({
			format: 'dev'
		, stream: {
				write: function(x) {
					app.logger.info(typeof x === 'string' ? x.trim() : x);
			}
		}
	});
};
