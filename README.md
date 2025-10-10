# 🤖 AI Image Classifier - Full-Stack Application 🚀

This is a full-stack web application that uses a **deep learning model** to classify images in real-time.
The frontend is built with **React**, the backend API with **FastAPI**, and the image classification model is a **Convolutional Neural Network (CNN)** trained with **TensorFlow/Keras** on the CIFAR-10 dataset.

---

## ✨ Features

* ⚡ **Real-Time Prediction:** Upload an image and get the top 3 predictions from the model.
* 🖱️ **Drag-and-Drop Interface:** A modern, user-friendly interface for uploading images, built with `react-dropzone`.
* 📊 **Animated Confidence Bars:** Visual feedback on the model's confidence for each prediction.
* 📱 **Responsive Design:** Works seamlessly on both desktop and mobile devices.
* ⚙️ **RESTful API Backend:** A high-performance FastAPI server serves the trained machine learning model.

---

## 🛠️ Tech Stack

**Frontend:** React, Vite, Tailwind CSS, Axios, React-Dropzone
**Backend:** Python, FastAPI, Uvicorn
**Machine Learning:** TensorFlow, Keras, Scikit-learn, NumPy, Jupyter

---

## 📂 Project Structure

```
cifar10-app/
├── backend/
│   ├── uploads/
│   ├── app.py
│   ├── cnn_model_finetuned.h5
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── ml_model/
│   └── train_model.ipynb
│
├── .gitignore
└── README.md
```

---

## ⚙️ Setup and Installation

Follow these steps to get the project running locally.

### 🧾 Prerequisites

* Node.js (v18 or higher)
* Python (v3.9 or higher) with `pip` and `venv`

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

---

### 2️⃣ Model Training 🧠

The first and most important step is to train the model, as the backend depends on the saved model file.

Navigate to the machine learning folder:

```bash
cd ml_model
```

Start Jupyter Lab or Jupyter Notebook:

```bash
jupyter lab
```

Open **`train_model.ipynb`** and run all the cells. This will train the CNN model, fine-tune it, and save the final version as **`cnn_model_finetuned.h5`** in the `ml_model` directory.

**Crucial Step:** Move the saved model file from the `ml_model` directory to the `backend` directory.

---

### 3️⃣ Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create and activate a Python virtual environment:

```bash
# For Windows
python -m venv venv
venv\Scripts\activate

# For macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

Install the required Python packages:

```bash
pip install -r requirements.txt
```

---

### 4️⃣ Frontend Setup

In a new terminal, navigate to the frontend directory:

```bash
cd frontend
```

Install the required npm packages:

```bash
npm install
```

---

## 🚀 Running the Application

You need to have **two terminals open simultaneously** to run both the backend and frontend servers.

### 🧩 1. Start the Backend Server

```bash
uvicorn app:app --reload
```

The API will be running at 👉 [http://localhost:8000](http://localhost:8000)

---

### 💻 2. Start the Frontend Server

```bash
npm run dev
```

The React app will be running at 👉 [http://localhost:5173](http://localhost:5173) (or another port if 5173 is busy).

---

## 📋 API Endpoints

### **GET /health**

**Description:** A simple health check to confirm the server is running.
**Response:**

```json
{"message": "API is up and running!"}
```

### **POST /upload**

**Description:** Accepts an image file for classification.
**Request Body:** `multipart/form-data` with a key named `file`.
**Response:** A JSON object with the top 3 predictions.

```json
{
  "top_predictions": [
    { "label": "truck", "confidence": 0.9512 },
    { "label": "automobile", "confidence": 0.0421 },
    { "label": "ship", "confidence": 0.0054 }
  ]
}
```

---

## 🧭 Future Enhancements

* 🧠 Fine-tune the CNN using transfer learning with a larger dataset.
* ☁️ Deploy the app to Render, Vercel, or AWS for public access.
* 🎨 Add better result visualization (e.g., bar charts, prediction history).

---

## 👨‍💻 Author

**Ruthvik Gurrala**
Machine Learning & Software Development Intern
[GitHub Profile](https://github.com/ruthvikgurrala)

---

### 🏁 License

This project is open-source and available under the **MIT License**.
