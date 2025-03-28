document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('userInput');
    const submitBtn = document.getElementById('submitBtn');
    const responseBox = document.getElementById('response');

    submitBtn.addEventListener('click', handleSearch);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    async function handleSearch() {
        const question = userInput.value.trim();
        if (!question) return;

        responseBox.innerHTML = '<div class="loading">Thinking</div>';
        responseBox.style.minHeight = '200px';

        try {
            const response = await fetch('http://localhost:5000/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: question })
            });

            const data = await response.json();
            responseBox.textContent = data.response;
            
            
            responseBox.style.minHeight = 'auto';
            responseBox.style.height = 'auto';
            responseBox.style.height = responseBox.scrollHeight + 'px';
            
        } catch (error) {
            responseBox.textContent = 'Error: ' + error.message;
        }
    }
});