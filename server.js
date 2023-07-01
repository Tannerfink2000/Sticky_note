const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/index');
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up the API routes
app.use('/api', apiRoutes);

// Set up the static file serving
app.use(express.static(path.join(__dirname, 'public')));

// Add this to handle direct requests for your 'notes' page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// Add this to handle any other unknown routes to send back to the home page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));
