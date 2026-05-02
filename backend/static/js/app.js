const API_URL = '';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('feedbackForm');
    const textInput = document.getElementById('feedbackText');
    const submitBtn = document.getElementById('submitBtn');
    const statusMessage = document.getElementById('statusMessage');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const text = textInput.value.trim();
        
        if (!text) {
            showMessage('Please enter some feedback.', 'error');
            return;
        }

        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        try {
            const response = await fetch(`${API_URL}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: text })
            });

            const data = await response.json();

            if (response.ok) {
                showMessage('Thank you! Your feedback has been submitted anonymously.', 'success');
                textInput.value = ''; // Clear form
            } else {
                showMessage(data.message || 'Failed to submit feedback.', 'error');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            showMessage('Network error. Please try again later.', 'error');
        } finally {
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Feedback';
        }
    });

    function showMessage(msg, type) {
        statusMessage.textContent = msg;
        statusMessage.className = `message ${type}`;
        
        // Hide message after 5 seconds
        setTimeout(() => {
            statusMessage.style.display = 'none';
            statusMessage.className = 'message';
        }, 5000);
    }
});
