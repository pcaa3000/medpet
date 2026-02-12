//import whatsappService from './whatsappService.js';
const whatsappService = require('./whatsappService.js');

//class for message handling
class MessageHandler {
  //function to handle incoming messages
  async handleMessage(message) {
    //check if the message is a text message
    if (message.type === 'text') {
      const phoneNumber = message.from;
      const text = message.text.body;
      console.log(`Received message from ${phoneNumber}: ${text}`);
      
      //send a response back to the user
      const responseMessage = `You said: ${text}`;
      await whatsappService.sendMessage(phoneNumber, responseMessage);
    }
  }
}
module.exports= new MessageHandler();
