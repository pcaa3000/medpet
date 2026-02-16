//import whatsappService from './whatsappService.js';
const whatsappService = require('./whatsappService.js');

//class for message handling
class MessageHandler {
  //function to handle incoming messages
  async handleMessage(message, senderInfo) {
    //check if the message is a text message
    if (message.type === 'text') {
      const phoneNumber = message.from;
      const text = message.text.body;
      console.log(`Received message from ${phoneNumber}: ${text}`);
      
      //check if the message is a greeting
      if (this.isGreeting(text)) {
        await this.sendWelcomeMessage(phoneNumber, senderInfo);
      } else {
        //send a response back to the user
        const responseMessage = `You said: ${text}`;
        await whatsappService.sendMessage(phoneNumber, responseMessage);
      }
      //mark the message as read
      await whatsappService.markMessageAsRead(message.id);
    }
  }
  //function to validate is message is a greeting
  isGreeting(message) {
    const greetings = ['hi', 'hello', 'hey', 'greetings','hola','que tal','good morning','good afternoon','good evening','buenos dias','buenas tardes','buenas noches'];
    return greetings.includes(message.toLowerCase());
  }
  //function to send a welcome message to the user
  async sendWelcomeMessage(phoneNumber, senderInfo) {
    const name = this.getSenderName(senderInfo);
    const welcomeMessage = `Bienvenido a nuestro servicio de veterinaria, ${name}. ¿En qué podemos ayudarte hoy?`;
    await whatsappService.sendMessage(phoneNumber, welcomeMessage);
  }
  //function to get sender Name
  getSenderName(senderInfo) {
    const fullName = senderInfo?.profile?.name || senderInfo.wa_id || 'Usuario';
    return fullName.split(' ')[0]; // Return the first name
  }
}
module.exports= new MessageHandler();
