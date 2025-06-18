const axios = require('axios');

async function testServer() {
  try {
    console.log('🧪 Testing server...');
    
    // Test health endpoint
    const healthResponse = await axios.get('http://localhost:3001/api/health');
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test recipes endpoint
    const recipesResponse = await axios.get('http://localhost:3001/api/recipes');
    console.log('✅ Recipes endpoint working:', recipesResponse.data);
    
    console.log('🎉 All tests passed! Server is ready.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('Make sure the server is running on port 3001');
  }
}

testServer(); 