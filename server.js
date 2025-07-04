require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path'); // Node.js built-in module for path manipulation

const app = express();
const port = process.env.PORT || 3000; // Use port from .env or default to 3000

// 1. Get your API key securely from environment variables
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
    console.error('Error: GEMINI_API_KEY not found in .env file.');
    console.error('Please make sure you have created a .env file with GEMINI_API_KEY=YOUR_API_KEY_HERE');
    process.exit(1); // Exit if API key is missing
}

// 2. Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(API_KEY);

// Middleware to parse JSON request bodies
app.use(express.json());

// *** ADD THIS ROUTE HERE ***
// Serve the index.html file when the root URL is accessed
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve static files (your frontend CSS, JS, etc.) from the 'public' directory
// This should typically come after specific routes like the one above,
// but before any "catch-all" routes.
app.use(express.static(path.join(__dirname, 'public')));


// 3. Create an API endpoint for your frontend to send prompts to
app.post('/generate-text', async (req, res) => {
    try {
        const { prompt } = req.body; // Get the prompt from the frontend request body

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required.' });
        }

        // Choose the model (e.g., "gemini-pro" for text, "gemini-1.5-flash" for speed)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

        // Generate content using the Gemini model
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text(); // Extract the generated text

        // Send the generated text back to the frontend
        res.json({ generatedText: text });

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        // Provide a more user-friendly error message to the frontend
        res.status(500).json({ error: 'Failed to generate text. Please try again or check server logs.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
    console.log(`Open your browser and navigate to: http://localhost:${port}`);
});