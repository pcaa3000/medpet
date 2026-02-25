//import whatsappService from './whatsappService.js';
const whatsappService = require('./whatsappService.js');

//class for message handling
class MessageHandler {
  constructor() {
    this.appointmentState = {};
  }
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
      } else if(text.toLowerCase() === 'image' || text.toLowerCase() === 'video' || text.toLowerCase() === 'audio' || text.toLowerCase() === 'document'){
        await this.sendMediaMessage(phoneNumber, text.toLowerCase());
      } else if(this.appointmentState[phoneNumber]){
        await this.handleAppointmentFlow(phoneNumber, text);
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
        this.appointmentState[phoneNumber] = { step: 'name' }; // Initialize the appointment flow state
        responseMessage = 'Vamos a agendar una cita. Por favor, proporciona tu nombre para comenzar.';
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
  //function to send a media message
  async sendMediaMessage(phoneNumber,  mediaType) {
    let mediaUrl, caption;
    switch (mediaType) {
      case 'image':
        mediaUrl = 'https://s3.amazonaws.com/gndx.dev/medpet-imagen.png';
        caption = 'This is an image';
        break;
      case 'video':
        mediaUrl = 'https://s3.amazonaws.com/gndx.dev/medpet-video.mp4';
        caption = 'This is a video';
        break;
      case 'audio':
        mediaUrl = 'https://s3.amazonaws.com/gndx.dev/medpet-audio.aac';
        break;
      case 'document':
        mediaUrl = 'https://s3.amazonaws.com/gndx.dev/medpet-file.pdf';
        caption = 'This is a document';
        break;
      default:
        throw new Error(`Unsupported media type: ${mediaType}`);
    }
    await whatsappService.sendMediaMessage(phoneNumber, mediaUrl, mediaType, caption);
  }
  //funtion to complete the appointment flow
  completeAppointmentFlow(phoneNumber) {
    const appointmentDetails = this.appointmentState[phoneNumber];
    // Here you can save the appointment details to a database or send it to the veterinary staff 
    delete this.appointmentState[phoneNumber];
    const userData = [phoneNumber, appointmentDetails.name, appointmentDetails.petName, appointmentDetails.petType, appointmentDetails.reason, appointmentDetails.datetime];
    return `¡Gracias! Tu cita ha sido agendada con los siguientes detalles:\nNombre: ${appointmentDetails.name}\nNombre de la mascota: ${appointmentDetails.petName}\nTipo de mascota: ${appointmentDetails.petType}\nMotivo: ${appointmentDetails.reason}\nFecha y hora: ${appointmentDetails.datetime}
    \nNos pondremos en contacto contigo para confirmar la cita.`;
  }
  //function to handke appointment flow
  async handleAppointmentFlow(phoneNumber,message) {
    // Implement the appointment scheduling flow here
    const state = this.appointmentState[phoneNumber] || 'initial';
    let responseMessage;
    switch (state.step) {
      case 'name':
        // Ask the name of the pet
        state.name = message
        responseMessage = 'Gracias, ¿Cuál es el nombre de tu mascota?';
        state.step = 'pet_name';
        break;
      case 'pet_name':
        // Ask the type of pet
        state.petName = message;
        responseMessage = '¿Qué tipo de mascota tienes? (Perro, Gato, etc.)';
        state.step = 'pet_type';
        break;
      case 'pet_type':
        // Ask the reason for the appointment
        state.petType = message;
        responseMessage = '¿Cuál es el motivo de la cita?';
        state.step = 'reason';
        break;
      case 'reason':
        // ask the date and time for the appointment
        state.reason = message;
        responseMessage = '¿Cuándo te gustaría agendar la cita? (Por favor proporciona una fecha y hora (DD/MM/YYYY HH:mm))';
        state.step = 'datetime';
        break;
      case 'datetime':
        // Confirm the appointment details
        state.datetime = message;
        responseMessage = `Tu cita será agendada para el ${state.datetime}. ¿Es correcto? (Sí/No)`;
        state.step = 'confirmation';
        break;
      case 'confirmation':
        if (message.toLowerCase() === 'sí' || message.toLowerCase() === 'si') {
          // Save the appointment details to the database or send it to the veterinary staff
          responseMessage = this.completeAppointmentFlow(phoneNumber);
        } else {
          responseMessage = 'Entendido, no se ha agendado la cita. Si deseas intentarlo de nuevo, por favor proporciona los detalles nuevamente.';
          delete this.appointmentState[phoneNumber]; // Clear the state if not confirmed
        }
        break;
      default:
        responseMessage = '¡Hola! Para agendar una cita, por favor proporciona tu nombre.';
        state.step = 'name';
    }
    this.appointmentState[phoneNumber] = state; // Save the state for the user
    await whatsappService.sendMessage(phoneNumber, responseMessage);
  }
}
module.exports= new MessageHandler();




