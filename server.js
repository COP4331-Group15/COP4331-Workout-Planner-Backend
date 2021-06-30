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

/*
// If we're hosted on the server, it's best to set a "static" folder. For this case,
// we'll bind the frontend/build static folder, so we attempt to serve that to the
// clients.
if(process.env.NODE_ENV === 'production')
{
    // Set static folder
    app.use(express.static('frontend/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}*/

// DISABLED UNTIL FRONTEND IS FRAMEWORKED


// Begin execution of our application
app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
});