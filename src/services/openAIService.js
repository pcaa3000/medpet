// import OpenAI from 'openai';
const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.AI_API_KEY,
  baseURL: process.env.AI_API_URL /* here could put an ai router api as https://openrouter.ai/api/v1 */
});


//function to get response from OpenAI
async function getAIResponse(messages, systemPrompt) {
  try {
    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL,
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: messages }],
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