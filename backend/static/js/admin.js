const API_URL = '';

document.addEventListener('DOMContentLoaded', () => {
    fetchStats();
    fetchFeedbacks();
});

async function fetchStats() {
    try {
        const response = await fetch(`${API_URL}/stats`);
        if (!response.ok) throw new Error('Failed to fetch stats');
        
        const jsonResponse = await response.json();
        const stats = jsonResponse.data;
        
        document.getElementById('statTotal').textContent = stats.total_feedback;
        document.getElementById('statPositive').textContent = stats.positive;
        document.getElementById('statNeutral').textContent = stats.neutral;
        document.getElementById('statNegative').textContent = stats.negative;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function fetchFeedbacks() {
    const listContainer = document.getElementById('feedbackList');
    
    try {
        const response = await fetch(`${API_URL}/feedbacks`);
        if (!response.ok) throw new Error('Failed to fetch feedbacks');
        
        const jsonResponse = await response.json();
        const feedbacks = jsonResponse.data;
        
        if (feedbacks.length === 0) {
            listContainer.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">No feedback available.</p>';
            return;
        }
        
        // Sort feedbacks newest first
        feedbacks.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        listContainer.innerHTML = '';
        
        feedbacks.forEach(feedback => {
            const card = document.createElement('div');
            const sentimentLower = feedback.sentiment.toLowerCase();
            card.className = `feedback-card ${sentimentLower}`;
            
            // Format timestamp nicely
            const date = new Date(feedback.timestamp);
            const formattedDate = new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
            
            card.innerHTML = `
                <div class="text">${escapeHTML(feedback.text)}</div>
                <div class="meta">
                    <span class="timestamp">${formattedDate}</span>
                    <span class="sentiment-badge ${sentimentLower}">${feedback.sentiment}</span>
                </div>
            `;
            
            listContainer.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error loading feedbacks:', error);
        listContainer.innerHTML = `
            <div class="message error" style="display: block; text-align: center;">
                <strong>Backend is not reachable.</strong><br>
                Please ensure the server is running on port 5000.
            </div>
        `;
    }
}

// Helper to prevent XSS when displaying user input
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
