const express = require('express');
const app = express();

// adding environment variables configuration file
require('dotenv').config();
const port = process.env.APP_PORT;

// adding the start up routes
require('./startup/routes')(app);

require('./database/mongo.service')();

app.use(express.json({ limit: '50mb' }));

// running the app on the port
app.listen(port, () => {
  console.log(`Listening on port ${port} . . .`);
});
