//import axios.js for making HTTP requests
const axios = require('axios');

//base function to send a message to WhatsApp
async function sendToWhatsApp(data) {
    const url = `${process.env.BASE_URL}/${process.env.API_VERSION}/${process.env.BUSINESS_PHONE}/messages`;
    const headers = {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
        'Content-Type': 'application/json'
    };
    try {
        const response = await axios.post(url, data, { headers });
        return response.data;
    } catch (error) {
        console.error('Error response from WhatsApp API:', error.response?.data);
        throw new Error(`Error sending WhatsApp interactive button message: ${error.message}`);
    }
}
module.exports = sendToWhatsApp;