module.exports = function(express) {
  app.set('mongo-uri', 'mongodb://lcurry:test@localhost:27017/nowjs-chat');
	app.set('app-secret', '12monkeys');
};
