// Import Express.js
const express = require('express');
// Import webhook routes
const webhookRoutes = require('./routes/webhookRoutes.js');

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Use webhook routes
app.use('/', webhookRoutes);

// Set port
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});