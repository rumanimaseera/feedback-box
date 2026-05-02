from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from services.sentiment import analyze_sentiment
from services.storage import save_feedback, get_all_feedbacks, get_stats

app = Flask(__name__)
# Enable CORS for all routes so frontend can interact with backend without issues
CORS(app)

@app.route('/submit', methods=['POST'])
def submit_feedback():
    """
    Accepts feedback text, analyzes sentiment, and saves it.
    """
    data = request.get_json(silent=True)
    
    # Improved input validation
    if data is None or 'text' not in data:
        return jsonify({"status": "error", "message": "Invalid JSON format or missing 'text' field in request body"}), 400
        
    text = data.get('text', '').strip()
    if not text:
        return jsonify({"status": "error", "message": "Feedback text cannot be empty"}), 400
        
    # Real sentiment analysis
    sentiment = analyze_sentiment(text)
    
    # Save feedback with timestamp
    entry = save_feedback(text, sentiment)
    
    return jsonify({
        "status": "success",
        "message": "Feedback submitted successfully",
        "data": entry
    }), 201

@app.route('/feedbacks', methods=['GET'])
def list_feedbacks():
    """
    Returns a list of all feedback entries.
    """
    feedbacks = get_all_feedbacks()
    return jsonify({"status": "success", "data": feedbacks}), 200

@app.route('/stats', methods=['GET'])
def analytics():
    """
    Returns analytics for the feedback (total, positive, negative, neutral counts).
    """
    stats = get_stats()
    return jsonify({"status": "success", "data": stats}), 200

@app.route("/")
def home():
    return render_template('index.html')

@app.route("/admin")
def admin():
    return render_template('admin.html')
    
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

if __name__ == '__main__':
    app.run(debug=True, port=5000)

