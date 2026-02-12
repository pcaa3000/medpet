//import messageHandler from '../services/messageHandler.js';
const messageHandler = require('../services/messageHandler.js');

//controller for handling webhook requests
class WebhookController {
  //function to process handleIncomingMessage webhook requests
  async handleIncomingMessage(req, res) {
    try {
      // check if the webhook request contains a message
      const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
      if (message) {
        await messageHandler.handleMessage(message);
      }
      res.status(200).send('EVENT_RECEIVED');
    } catch (error) {
      console.error('Error handling incoming message:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  //function to verify the webhook
  verifyWebhook(req, res) {
    const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;
    const verifyToken = process.env.VERIFY_TOKEN;
    
    if (mode === 'subscribe' && token === verifyToken) {
      console.log('WEBHOOK VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.status(403).end();
    }
  }
}
module.exports = new WebhookController();
