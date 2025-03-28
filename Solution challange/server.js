require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5000;


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.post('/api/search', async (req, res) => {
    try {
        const { query } = req.body;
        
        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(query);
        const response = await result.response;
        const text = response.text();

        res.json({ 
            response: text,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ 
            error: 'Failed to process your request',
            details: error.message 
        });
    }
});


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'future.html'));
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});