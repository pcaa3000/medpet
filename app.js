// Import Express.js
const express = require('express');
const axios = require('axios');

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set port and verify_token
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;
const businessPhone = process.env.BUSINESS_PHONE;
const apiVersion = process.env.API_VERSION;

//function to send a message using the WhatsApp Business API
async function sendMessage(phoneNumber, message) {
  const url = `https://graph.facebook.com/${apiVersion}/${businessPhone}/messages`;
  const data = {
    messaging_product: 'whatsapp',
    to: phoneNumber,
    text: { body: message },
  };
  try {
    const response = await axios.post(url, data, {
      headers: {
        'Authorization': `Bearer ${process.env.API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Message sent:', response.data);
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message);
  }
}

// Route for GET requests
app.get('/', (req, res) => {
  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
});

// Route for POST requests
app.post('/', (req, res) => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`\n\nWebhook received ${timestamp}\n`);
  console.log(JSON.stringify(req.body, null, 2));

  // check if the webhook request contains a message
  const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  //check if the incoming message is a text message
  if (message && message.type === 'text') {
    const phoneNumber = message.from;
    const text = message.text.body;
    console.log(`Received message from ${phoneNumber}: ${text}`);
    
    // send a response message back to the user
    const responseMessage = `You said: ${text}`;
    sendMessage(phoneNumber, responseMessage);
  }
  res.status(200).end();
});

// Start the server
app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
});



