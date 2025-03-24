const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');


const add = require('./amazon/combainData');

const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Basic route returning a name
app.get('/', (req, res) => {
  res.sendStatus(200);
});

// Route to handle search display
app.post('/display', (req, res) => {
  // Process search request and return response
  console.log(req.body)
  add(req.body.state.search)
    .then((response) => {
      res.json({ ress: response });
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred while processing the request' });
    });
});

// Route to handle app data requests
app.post('/app', (req, res) => {
  // Simulate async response with 1-second delay
  setTimeout(() => {
    if (req.body.state.search === 'iphone') {
      res.json({ data });
    } else {
      res.json({ data1 });
    }
  }, 1000);
});


app.listen(7000, () => {
  console.log('Server is running on port 7000');
});