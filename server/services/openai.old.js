const OpenAI = require('openai');
const fs = require('fs').promises;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Analyzes a fridge photo and suggests recipes based on visible ingredients
 * @param {string} base64Image - Base64 encoded image data
 * @returns {Promise<Array>} Array of recipe suggestions
 */
async function analyzeFridgePhoto(base64Image) {
  try {
    console.log('🤖 Sending photo to OpenAI for analysis...');

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are a helpful cooking assistant. Look at this photo of a fridge and:

1. Identify all the visible ingredients and food items
2. Suggest 3-5 delicious recipes that can be made with these ingredients
3. For each recipe, provide:
   - Recipe name
   - List of ingredients (mark which ones are visible in the fridge)
   - Simple cooking instructions (3-4 steps)
   - Estimated cooking time
   - Difficulty level (Easy/Medium/Hard)

Format your response as a JSON array of recipe objects. Be creative but practical with your suggestions!`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 1500,
      temperature: 0.7
    });

    const content = response.choices[0].message.content;
    
    // Try to parse JSON response
    try {
      const recipes = JSON.parse(content);
      console.log(`✅ Successfully analyzed photo and found ${recipes.length} recipe suggestions`);
      return recipes;
    } catch (parseError) {
      console.log('⚠️ Could not parse JSON response, returning raw text');
      return [{
        name: "Recipe Suggestions",
        ingredients: ["See details below"],
        instructions: content,
        cookingTime: "Varies",
        difficulty: "See instructions"
      }];
    }

  } catch (error) {
    console.error('❌ OpenAI API Error:', error);
    
    if (error.code === 'insufficient_quota') {
      throw new Error('OpenAI API quota exceeded. Please check your account.');
    } else if (error.code === 'invalid_api_key') {
      throw new Error('Invalid OpenAI API key. Please check your configuration.');
    } else {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }
}

/**
 * Gets a simple recipe suggestion without photo analysis (fallback)
 * @returns {Array} Array of sample recipes
 */
function getSampleRecipes() {
  return [
    {
      name: "Quick Pasta Dish",
      ingredients: ["pasta", "olive oil", "garlic", "salt", "pepper"],
      instructions: "Boil pasta, sauté garlic in oil, combine and season",
      cookingTime: "15 minutes",
      difficulty: "Easy"
    },
    {
      name: "Simple Salad",
      ingredients: ["lettuce", "tomatoes", "cucumber", "olive oil", "vinegar"],
      instructions: "Wash vegetables, chop, mix with oil and vinegar",
      cookingTime: "10 minutes",
      difficulty: "Easy"
    }
  ];
}

module.exports = {
  analyzeFridgePhoto,
  getSampleRecipes
}; 