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
        await this.sendWelcomeMenu(phoneNumber);
      } else {
        //send a response back to the user
        const responseMessage = `You said: ${text}`;
        await whatsappService.sendMessage(phoneNumber, responseMessage);
      }
      //mark the message as read
      await whatsappService.markMessageAsRead(message.id);
    }
    //check if the message is a interactive button response
    if (message.type === 'interactive') {
      const phoneNumber = message.from;
      const option = message.interactive.button_reply.id;
      console.log(`The user ${phoneNumber} selected option: ${option}`);
      //send a option to menu handler
      await this.handleMenuOption(option, phoneNumber);
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
  //function to send a welcome Menu with interactive buttons
  async sendWelcomeMenu(phoneNumber) {    
    const welcomeMessage = "Elige una opción:";
    const buttons = [
      {
        type: 'reply',
        reply: {
          id: 'opcion_1',
          title: 'Citas'
        }
      },
      {
        type: 'reply',
        reply: {
          id: 'opcion_2',
          title: 'Consultas'
        }
      },
      {
        type: 'reply',
        reply: {
          id: 'opcion_3',
          title: 'Ubicación'
        }
      }
    ];
    await whatsappService.sendInteractiveButtonMessage(phoneNumber, welcomeMessage, buttons);
  }
  //function to handle menu options
  async handleMenuOption(option, phoneNumber) {
    let responseMessage;
    switch (option) {
      case 'opcion_1':
        //await this.sendCitasMenu(phoneNumber);
        responseMessage = 'Vamos a agendar una cita';
        break;
      case 'opcion_2':
        //await this.sendServiciosMenu(phoneNumber);
        responseMessage = 'Realiza tu consulta';
        break;
      case 'opcion_3':
        //await this.sendUbicacionMenu(phoneNumber);
        responseMessage = 'Te enviamos la ubicación';
        break;
      default:
        //await whatsappService.sendMessage(phoneNumber, 'Opción no válida');
        responseMessage = 'Opción no válida';
    }
    await whatsappService.sendMessage(phoneNumber, responseMessage);
  }
}
module.exports= new MessageHandler();

