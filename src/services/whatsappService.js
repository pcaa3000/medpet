//import axios.js for making HTTP requests
const axios = require('axios');

//class to handle WhatsApp Business API interactions
class WhatsAppService {
  /*constructor(apiVersion, businessPhone, apiToken) {
    this.apiVersion = apiVersion;
    this.businessPhone = businessPhone;
    this.apiToken = apiToken;
  }*/
  constructor() {
    this.apiVersion = process.env.API_VERSION;
    this.businessPhone = process.env.BUSINESS_PHONE;
    this.apiToken = process.env.API_TOKEN;
  } 
  //function to send a message using the WhatsApp Business API
  async sendMessage(phoneNumber, message) {
    const url = `https://graph.facebook.com/${this.apiVersion}/${this.businessPhone}/messages`;
    const data = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      text: {
        body: message
      }
    };
    const headers = {
      Authorization: `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json'
    };
    try {
      const response = await axios.post(url, data, { headers });
      return response.data;
    } catch (error) {
      throw new Error(`Error sending WhatsApp message: ${error.message}`);
    }
  }

  //function to mark a message as read using the WhatsApp Business API
  async markMessageAsRead(messageId) {
    const url = `https://graph.facebook.com/${this.apiVersion}/${this.businessPhone}/messages`;
    const data = {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId
    };
    const headers = {
      Authorization: `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json'
    };
    try {
      const response = await axios.post(url, data, { headers });
      return response.data;
    } catch (error) {
      throw new Error(`Error marking WhatsApp message as read: ${error.message}`);
    }
  }
  //function to send a interactive button message using the WhatsApp Business API
  async sendInteractiveButtonMessage(phoneNumber, message, buttons) {
    const url = `https://graph.facebook.com/${this.apiVersion}/${this.businessPhone}/messages`;
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
    const headers = {
      Authorization: `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json'
    };
    try {
      const response = await axios.post(url, data, { headers });
      return response.data;
    } catch (error) {
      throw new Error(`Error sending WhatsApp interactive button message: ${error.message}`);
    }
  }
  //function to send media message
  async sendMediaMessage(phoneNumber, mediaUrl, mediaType, caption) {
    const url = `https://graph.facebook.com/${this.apiVersion}/${this.businessPhone}/messages`;
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
    const headers = {
      Authorization: `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json'
    };
    try {
      const response = await axios.post(url, data, { headers });
      return response.data;
    } catch (error) {
      throw new Error(`Error sending WhatsApp media message: ${error.message}`);
    }
  }
} 

module.exports = new WhatsAppService();