const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from the current directory
app.use(express.static('./'));

// For any route not found, serve the index.html
app.get('*', (req, res) => {
  res.sendFile(path.resolve('.', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});