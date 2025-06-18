import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadStatus(null);
      setRecipes(null);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadStatus(null);
      setRecipes(null);
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) return;
    setUploadStatus('Uploading...');
    setRecipes(null);
    const formData = new FormData();
    formData.append('photo', selectedFile);
    try {
      const response = await fetch('http://localhost:3001/api/recipes/analyze-fridge', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      const data = await response.json();
      setUploadStatus('Success!');
      setRecipes(data.recipes);
    } catch (error) {
      setUploadStatus('Error uploading image');
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f6f8fa', minHeight: '100vh', padding: '32px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #0001', padding: 32 }}>
        <h1 style={{ fontSize: 36, marginBottom: 8 }}>🍳 Fridge Recipe Finder</h1>
        <p style={{ fontSize: 18, marginBottom: 24 }}>Take a photo of your fridge and get delicious recipe suggestions!</p>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, marginBottom: 12 }}>📸 Upload Your Fridge Photo</h2>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {previewUrl && (
            <div style={{ marginTop: 16 }}>
              <p style={{ marginBottom: 8 }}>Preview:</p>
              <img src={previewUrl} alt="Fridge preview" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, boxShadow: '0 1px 6px #0002' }} />
            </div>
          )}
          <button
            onClick={uploadImage}
            disabled={!selectedFile}
            style={{
              marginTop: 16,
              padding: '10px 24px',
              background: selectedFile ? '#6366f1' : '#a5b4fc',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              fontSize: 16,
              cursor: selectedFile ? 'pointer' : 'not-allowed',
              fontWeight: 600,
              boxShadow: selectedFile ? '0 2px 8px #6366f133' : 'none'
            }}
          >
            Send to backend
          </button>
          {uploadStatus && <p style={{ marginTop: 10, color: uploadStatus === 'Success!' ? 'green' : 'red' }}>{uploadStatus}</p>}
        </div>
        {recipes && (
          <div style={{
            marginTop: 32,
            background: '#f9fafb',
            borderRadius: 8,
            padding: 24,
            boxShadow: '0 1px 6px #0001',
            maxHeight: 400,
            overflowY: 'auto'
          }}>
            <h3 style={{ fontSize: 22, marginBottom: 16 }}>🍽️ Recipe Suggestions:</h3>
            <ReactMarkdown>{recipes}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
