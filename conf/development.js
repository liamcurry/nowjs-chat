var express = require('express');

module.exports = function() {
  app.set('mongo-uri', 'mongodb://lcurry:test@localhost:27017/nowjs-chat');
	app.set('app-secret', '12monkeys');
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
};
