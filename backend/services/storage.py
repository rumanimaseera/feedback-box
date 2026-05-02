import os
import json
import datetime
import firebase_admin
from firebase_admin import credentials, firestore

# In-memory fallback
_feedbacks = []

firebase_db = None

try:
    firebase_key = os.environ.get("FIREBASE_KEY")

    if firebase_key:
        # Load Firebase from environment variable (Render)
        cred_dict = json.loads(firebase_key)
        cred = credentials.Certificate(cred_dict)
        firebase_admin.initialize_app(cred)
        firebase_db = firestore.client()
        print("Using Firebase storage (ENV)")
    
    else:
        # Local development fallback (file-based)
        base_dir = os.path.dirname(os.path.dirname(__file__))
        cred_path = os.path.join(base_dir, "serviceAccountKey.json")

        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            firebase_db = firestore.client()
            print("Using Firebase storage (LOCAL FILE)")
        else:
            print("Using fallback storage (memory)")

except Exception as e:
    print(f"Firebase init error: {e}")
    firebase_db = None


def save_feedback(text, sentiment):
    timestamp = datetime.datetime.utcnow().isoformat() + "Z"
    
    entry = {
        "text": text,
        "sentiment": sentiment,
        "timestamp": timestamp
    }

    if firebase_db:
        firebase_db.collection("feedbacks").add(entry)
    else:
        _feedbacks.append(entry)

    return entry


def get_all_feedbacks():
    if firebase_db:
        docs = firebase_db.collection("feedbacks").stream()
        return [doc.to_dict() for doc in docs]
    return _feedbacks


def get_stats():
    feedbacks = get_all_feedbacks()

    return {
        "total_feedback": len(feedbacks),
        "positive": sum(1 for f in feedbacks if f["sentiment"] == "Positive"),
        "negative": sum(1 for f in feedbacks if f["sentiment"] == "Negative"),
        "neutral": sum(1 for f in feedbacks if f["sentiment"] == "Neutral"),
    }