const express = require('express');
const multer = require('multer');
const { analyzeFridgePhoto } = require('../services/openai');

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
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No photo uploaded' });
    }

    console.log('📸 Processing fridge photo...');
    
    // Convert image to base64 for OpenAI API
    const imageBuffer = req.file.buffer;
    const base64Image = imageBuffer.toString('base64');
    
    // Analyze the photo with OpenAI
    const recipeSuggestions = await analyzeFridgePhoto(base64Image);
    
    res.json({
      success: true,
      recipes: recipeSuggestions,
      message: 'Recipe suggestions generated successfully!'
    });

  } catch (error) {
    console.error('Error analyzing fridge photo:', error);
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

module.exports = router; 