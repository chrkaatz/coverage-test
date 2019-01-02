const port = process.env.PORT || 3000;

const express = require('express');
const bodyParser = require('body-parser');

const api = require('./api/index.js');

const app = express();
app.use(bodyParser.json());
app.use(require('./middleware/version.js'));
api(app);

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

function shutDown() {
  console.log('Going to shutdown due to a kill signal');
  server.close(() => {
    console.log('server closed');
    process.exit(0);
  });
}

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);
