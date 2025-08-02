const express = require('express');
const path = require('path');
const cors = require('cors');
const generateCVPDF = require('./api/generate-cv-pdf');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for React app
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'build')));

// API endpoint for PDF generation
app.get('/api/generate-cv-pdf', generateCVPDF);

// Serve React app for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 PDF Server running on port ${PORT}`);
    console.log(`📄 PDF API available at: http://localhost:${PORT}/api/generate-cv-pdf`);
});

module.exports = app;
