# backend/app.py
"""
FastAPI backend to serve the CIFAR-10 image classification model.
"""
import os
import shutil
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from PIL import Image
import tensorflow as tf

# --- 1. App and CORS Configuration ---
app = FastAPI(title="CIFAR-10 Image Classification API")

# Allow requests from our React frontend
origins = [
    "http://localhost:5173", # Default Vite port
    "http://localhost:3000", # Default Create React App port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. Load the Trained Model and Class Names ---
# Use the improved, fine-tuned model
MODEL_PATH = "cnn_model_finetuned.h5" 
model = tf.keras.models.load_model(MODEL_PATH)
CLASS_NAMES = ['airplane', 'automobile', 'bird', 'cat', 'deer', 'dog', 'frog', 'horse', 'ship', 'truck']
UPLOAD_DIR = "uploads"

# Create upload directory if it doesn't exist
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# --- 3. Helper Function for Image Preprocessing ---
def preprocess_image(image: Image.Image):
    """
    Preprocesses the uploaded image to be model-compatible.
    """
    image = image.resize((32, 32))
    image_array = np.array(image)
    
    # Handle grayscale images by converting them to RGB
    if image_array.ndim == 2:
        image_array = np.stack((image_array,) * 3, axis=-1)
        
    # Ensure image has 3 channels (remove alpha if present)
    if image_array.shape[2] == 4:
        image_array = image_array[:, :, :3]
        
    image_array = image_array.astype('float32') / 255.0
    # Add a batch dimension (model expects (1, 32, 32, 3))
    image_array = np.expand_dims(image_array, axis=0)
    return image_array

# --- 4. API Endpoints ---
@app.get("/health", tags=["healthcheck"])
async def root():
    """Health check endpoint to ensure the server is running."""
    return {"message": "API is up and running!"}

@app.post("/upload", tags=["prediction"])
async def predict(file: UploadFile = File(...)):
    """
    Accepts an image, gets a prediction, and returns top 3 predictions.
    """
    # Save the uploaded file temporarily
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # Open and preprocess the image
        image = Image.open(file_path)
        processed_image = preprocess_image(image)

        # Make prediction
        predictions = model.predict(processed_image)[0]

        # Get top 3 predictions
        top_indices = predictions.argsort()[-3:][::-1]
        top_predictions = [
            {"label": CLASS_NAMES[i], "confidence": float(predictions[i])}
            for i in top_indices
        ]

        return {"top_predictions": top_predictions}
    finally:
        # Clean up the uploaded file
        if os.path.exists(file_path):
            os.remove(file_path)