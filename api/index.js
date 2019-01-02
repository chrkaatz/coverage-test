const hello = require('./hello.js');

module.exports = function(app) {

  app.get('/api', hello.get);
  app.post('/api', hello.post);
  app.put('/api', hello.put);
  app.get('*', hello.get);
}