// frontend/src/App.jsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

// A small, reusable component for the animated confidence bar
const ConfidenceBar = ({ confidence }) => {
  const percentage = (confidence * 100).toFixed(2);
  return (
    <div className="w-full bg-gray-700 rounded-full h-2.5">
      <div
        className="bg-gradient-to-r from-cyan-400 to-purple-500 h-2.5 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Setup drag-and-drop handler
  const onDrop = useCallback(acceptedFiles => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setPredictions([]); // Clear previous predictions
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] }
  });

  // Handle the prediction request to the backend
  const handlePredict = async () => {
    if (!file) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setPredictions([]);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Send the image to the FastAPI backend
      const response = await axios.post('http://localhost:8000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPredictions(response.data.top_predictions);
    } catch (err) {
      setError('Failed to get prediction. Please ensure the backend is running.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Clear the selection
  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setPredictions([]);
    setError('');
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <header className="text-center mb-8">
          {/* Updated Code */}
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600 leading-tight mb-2 py-2">
            AI Image Classifier
          </h1>
          <p className="text-gray-400 mt-2">Upload an image and see what our AI model thinks it is!</p>
        </header>

        {/* Main Content Card */}
        <main className="bg-gray-800/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl shadow-purple-500/10 border border-gray-700">
          {!preview ? (
            // Upload Zone
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors duration-300 ${isDragActive ? 'border-purple-500 bg-gray-700/50' : 'border-gray-600 hover:border-cyan-400'}`}
            >
              <input {...getInputProps()} />
              <p className="text-gray-400">
                {isDragActive ? "Drop the image here..." : "Drag & drop an image, or click to select"}
              </p>
            </div>
          ) : (
            // Preview and Control Zone
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2">
                <img src={preview} alt="Preview" className="rounded-xl w-full h-auto object-cover" />
              </div>
              <div className="w-full md:w-1/2 flex flex-col justify-center items-center gap-4">
                <button
                  onClick={handlePredict}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Analyzing...' : 'Predict'}
                </button>
                 <button
                  onClick={handleClear}
                  className="w-full bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-500 transition-colors duration-300"
                >
                  Clear Image
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
          
          {/* Results Section */}
          {(isLoading || predictions.length > 0) && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-center mb-4">Results</h2>
              {isLoading ? (
                <div className="flex justify-center items-center">
                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {predictions.map((pred, index) => (
                    <div key={index} className="bg-gray-700/50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-lg font-medium capitalize">{pred.label}</span>
                        <span className="font-mono text-cyan-300">{(pred.confidence * 100).toFixed(2)}%</span>
                      </div>
                      <ConfidenceBar confidence={pred.confidence} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;