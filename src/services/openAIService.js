// import OpenAI from 'openai';
const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.AI_API_KEY,
  baseURL: process.env.AI_API_URL
});

//context system for the AI
const systemContext = {
  role: 'system',
  content: 'Eres ue asistente virtual para una veterinaria llamada MedPet. Ayudas a los clientes a agendar citas, responder consultas como un veterinario experto lo más simple posible y proporcionar información sobre la ubicación de la veterinaria. Si es una emergencia, por favor indícales que llamen a un veterinario de emergencia. Siempre mantén un tono amigable y profesional, no saludes, no generes conversación. No recomiendes medicamentos sin la aprobación de un veterinario. No proporciones información que no esté relacionada con la veterinaria o sus servicios. Si el cliente hace una pregunta que no puedes responder, indícales que se comuniquen directamente con la veterinaria para obtener más información.'
};

//function to get response from OpenAI
async function getAIResponse(messages) {
  try {
    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL,
      messages: [systemContext, ...messages],
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error getting AI response:', error);
    return 'Lo siento, ha ocurrido un error al procesar tu solicitud. Por favor intenta de nuevo más tarde.';
  }
}

module.exports = {
  getAIResponse,
};