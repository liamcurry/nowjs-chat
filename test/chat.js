require('../app');

var Message = app.db.model('Message');
describe('Message', function() {
	describe('#save()', function() {
		it('should save without error', function(done) {
			var message = new Message({ name: 'bill', content: 'hello', type: 'msg' });
			message.save(done);
		});
  });
});
