document.getElementById('generateBtn').addEventListener('click', async () => {
    const promptInput = document.getElementById('promptInput');
    const resultOutput = document.getElementById('resultOutput');
    const prompt = promptInput.value.trim(); // Get prompt and remove leading/trailing whitespace

    if (prompt === '') {
        alert('Please enter a prompt!');
        return;
    }

    resultOutput.textContent = 'Generating response... Please wait.';
    resultOutput.classList.add('loading'); // Add a loading class for styling

    try {
        // Send the prompt to your Node.js backend
        const response = await fetch('/generate-text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: prompt }) // Send the prompt as JSON
        });

        if (!response.ok) {
            // If the server response is not OK (e.g., 4xx or 5xx), parse the error
            const errorData = await response.json();
            throw new Error(errorData.error || 'Server error occurred.');
        }

        const data = await response.json(); // Parse the JSON response from your backend
        resultOutput.textContent = data.generatedText; // Display Gemini's response
        promptInput.value = ''; // Clear the input field

    } catch (error) {
        console.error('Error fetching Gemini response:', error);
        resultOutput.textContent = `Error: ${error.message}`;
        resultOutput.style.color = 'red'; // Indicate an error visually

    } finally {
        resultOutput.classList.remove('loading'); // Remove loading class regardless of success/failure
    }
});