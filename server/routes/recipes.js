const express = require('express');
const multer = require('multer');
const { analyzeFridgePhoto } = require('../services/gemini');

const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// POST /api/analyze-fridge
// Analyzes a fridge photo and returns recipe suggestions
router.post('/analyze-fridge', upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No photo uploaded' });
  }

  try {
    const prompt = "List the main ingredients you see in this fridge photo and suggest 3 recipes I could make with them.";
    // Call the Gemini service
    const recipeSuggestions = await analyzeFridgePhoto(req.file.buffer, req.file.mimetype, prompt);

    res.json({
      success: true,
      recipes: recipeSuggestions,
      message: 'Recipe suggestions generated successfully!'
    });
  } catch (error) {
    console.error('Error analyzing fridge photo:', error.message);
    res.status(500).json({
      error: 'Failed to analyze photo',
      message: error.message
    });
  }
});

// GET /api/recipes
// Returns a list of sample recipes (for testing)
router.get('/recipes', (req, res) => {
  const sampleRecipes = [
    {
      name: "Pasta Carbonara",
      ingredients: ["pasta", "eggs", "bacon", "parmesan", "black pepper"],
      instructions: "Cook pasta, mix with eggs and bacon, top with parmesan"
    },
    {
      name: "Chicken Stir Fry",
      ingredients: ["chicken", "vegetables", "soy sauce", "garlic", "ginger"],
      instructions: "Stir fry chicken with vegetables and seasonings"
    }
  ];
  
  res.json({ recipes: sampleRecipes });
});

router.post('/photo', upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  try {
    const imagePath = path.join(__dirname, '..', req.file.path);
    const imageBuffer = await fs.readFile(imagePath);
    const imageBase64 = imageBuffer.toString('base64');

    const prompt = "List the main ingredients you see and suggest 3 recipes I could make with them.";
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { "url": `data:image/png;base64,${imageBase64}` } }
          ]
        }
      ],
      max_tokens: 500
    });

    const recipes = response.choices[0]?.message?.content || "No recipes found.";
    await fs.unlink(imagePath); // Clean up uploaded file
    res.json({ recipes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process image" });
  }
});

module.exports = router; 