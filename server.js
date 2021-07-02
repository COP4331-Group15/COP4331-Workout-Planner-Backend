// Load our environment variables
require('dotenv').config();

// Load our core backend libraries
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Prepare our port and path variables
const path = require('path');
const PORT = process.env.PORT || 5000;

// Create our express application
const app = express();

app.set('port', PORT);
app.use(cors());
app.use(bodyParser.json());

// Authenticate API requests
const decodeIDToken = require('./utils/authenticate-token');
app.use(decodeIDToken);

// Bind our endpoints
var api = require('./api.js');
api.setApp(app);

// Enable CORS access on our API - great for our testing purposes.
app.use((req, res, next) =>
{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

// Begin execution of our application
app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
});