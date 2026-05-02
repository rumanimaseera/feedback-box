# Cloud-Based Anonymous Feedback Box with Sentiment Analysis

A modern, full-stack web application that allows users to submit anonymous feedback and automatically categorizes it using sentiment analysis. The project features a clean, minimal frontend and a Python Flask backend with Firebase integration.

## Features
- **Anonymous Submissions**: Users can share their thoughts securely.
- **Sentiment Analysis**: Automatically analyzes feedback text and categorizes it as Positive, Neutral, or Negative.
- **Admin Dashboard**: Real-time overview of all feedback, including sentiment badges and aggregated statistics.
- **Cloud Database Ready**: Built-in support for Firebase Firestore with automatic in-memory fallback if credentials are not provided.
- **Modern UI**: Clean, responsive, and animated user interface using pure CSS.

## Tech Stack
- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (Vanilla)
- **Backend**: Python 3, Flask, Flask-CORS
- **Database**: Firebase Firestore (optional, falls back to in-memory)
- **Sentiment Analysis**: TextBlob

## Folder Structure
```text
feedback-box/
├── backend/
│   ├── app.py                 # Main Flask application and API endpoints
│   ├── requirements.txt       # Python dependencies
│   ├── serviceAccountKey.json # Firebase credentials (add your own)
│   └── services/
│       ├── sentiment.py       # TextBlob sentiment logic
│       └── storage.py         # Database/in-memory storage logic
├── frontend/
│   ├── index.html             # Feedback submission page
│   ├── admin.html             # Admin dashboard page
│   ├── css/
│   │   └── styles.css         # UI styling
│   └── js/
│       ├── app.js             # Submission logic
│       └── admin.js           # Dashboard logic
└── README.md
```

## Setup Instructions

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### 2. Firebase Setup (Optional)
To use a persistent database instead of the in-memory fallback:
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project and set up a **Firestore Database**.
3. Generate a new private key from **Project Settings > Service Accounts**.
4. Download the JSON file, rename it to `serviceAccountKey.json`, and place it in the `backend/` directory.

### 3. Running the Project

**Start the Backend:**
Inside the `backend/` directory, run:
```bash
python app.py
```
The server will start at `http://localhost:5000`.

**Start the Frontend:**
Since it's a simple HTML/JS frontend, you can either:
- Open `frontend/index.html` directly in your browser.
- Use a local server (e.g., Live Server extension in VS Code or Python's `http.server`):
  ```bash
  cd frontend
  python -m http.server 8000
  ```
  Then visit `http://localhost:8000`.

## API Endpoints
- **POST `/submit`**: Submit new feedback. Requires JSON payload `{"text": "your feedback"}`. Returns `{"status": "success", "message": "...", "data": {}}`.
- **GET `/feedbacks`**: Retrieve all submitted feedback. Returns `{"status": "success", "data": [...]}`.
- **GET `/stats`**: Get aggregated statistics. Returns `{"status": "success", "data": {"total_feedback": 0, "positive": 0, "negative": 0, "neutral": 0}}`.
