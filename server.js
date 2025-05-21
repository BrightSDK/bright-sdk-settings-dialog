const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Serve the example.html file as the root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dev', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Open your browser to see the settings dialog example`);
});