// import genai 
const { GenAI } = require('@google/generative-ai');
// Initialize GenAI client
const genai = new GenAI({
  apiKey: process.env.AI_API_KEY
});

//function to get response from GenAI
async function getAIResponse(messages, systemPrompt) {
  try {
    const response = await genai.models.generateContent({
      model: process.env.AI_MODEL,
      content: messages,
      config: {
        systemInstruction: systemPrompt
      }
    });
    return response.text;
  } catch (error) {
    console.error('Error getting AI response:', error);
    return 'Lo siento, ha ocurrido un error al procesar tu solicitud. Por favor intenta de nuevo más tarde.';
  }
}

module.exports = {
  getAIResponse,
};