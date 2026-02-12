// Import Express.js
const express = require('express');
// Import webhookController
const webhookController = require('../controllers/webhookController');

// Create an Express router
const router = express.Router();

// Middleware to parse JSON bodies
router.use(express.json());

// Route for GET requests to verify the webhook
router.get('/', webhookController.verifyWebhook);

// Route for POST requests to handle incoming messages
router.post('/', webhookController.handleIncomingMessage);

// Export the router
module.exports = router;