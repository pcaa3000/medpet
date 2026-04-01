//import sendToWhatsApp function to send messages to WhatsApp
const sendToWhatsApp = require('./httpRequest/sendToWhatsApp');

//class to handle WhatsApp Business API interactions
class WhatsAppService {
  //function to send a message using the WhatsApp Business API
  async sendMessage(phoneNumber, message) {
    const data = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      text: {
        body: message
      }
    };
    await sendToWhatsApp(data);
  }
  //function to mark a message as read using the WhatsApp Business API
  async markMessageAsRead(messageId) {
    const data = {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId
    };
    await sendToWhatsApp(data);
  }
  //function to send a interactive button message using the WhatsApp Business API
  async sendInteractiveButtonMessage(phoneNumber, message, buttons) {
    const data = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: {
          text: message
        },
        action: {
          buttons: buttons
        }
      }
    };
    await sendToWhatsApp(data);
  }
  //function to send media message
  async sendMediaMessage(phoneNumber, mediaUrl, mediaType, caption) {
    const mediaObject = {}
    switch (mediaType) {
      case 'image':
        mediaObject.image = { link: mediaUrl, caption: caption };
        break;
      case 'video':
        mediaObject.video = { link: mediaUrl, caption: caption };
        break;
      case 'audio':
        mediaObject.audio = { link: mediaUrl };
        break;
      case 'document':
        mediaObject.document = { link: mediaUrl, caption: caption };
        break;
      default:
        throw new Error(`Unsupported media type: ${mediaType}`);
    }
    const data = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: mediaType,
      ...mediaObject
    };
    await sendToWhatsApp(data);
  }
  //function to send contact message
  async sendContactMessage(phoneNumber, contacts) {
    const data = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'contacts',
      contacts: [contacts]
    };
    await sendToWhatsApp(data);
  }
  //function to send location message
  async sendLocationMessage(phoneNumber, latitude, longitude, name, address) {
    const data = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'location',
      location: {
        latitude: latitude,
        longitude: longitude,
        name: name,
        address: address
      }
    };
    await sendToWhatsApp(data);
  }  
} 

module.exports = new WhatsAppService();