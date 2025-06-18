const axios = require('axios');

/**
 * Analyze a fridge photo using Google Gemini Vision API.
 * @param {Buffer} imageBuffer - The image file buffer.
 * @param {string} mimeType - The image MIME type (e.g., 'image/png').
 * @param {string} prompt - The prompt/question for Gemini.
 * @returns {Promise<string>} - The model's text response.
 */
async function analyzeFridgePhoto(imageBuffer, mimeType, prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set in environment variables.');

  const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: mimeType,
              data: imageBuffer.toString('base64')
            }
          }
        ]
      }
    ]
  };

  try {
    const response = await axios.post(endpoint, requestBody);
    // Extract the model's reply
    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No recipes found.";
  } catch (error) {
    // Log the full error for debugging
    console.error('Gemini API error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error?.message || 'Failed to analyze image with Gemini');
  }
}

console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Loaded' : 'Missing');

module.exports = { analyzeFridgePhoto };
