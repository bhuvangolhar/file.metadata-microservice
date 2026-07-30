const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();

// Configure multer to store files in memory (no disk clutter)
const upload = multer({ storage: multer.memoryStorage() });

// Enable CORS
app.use(cors({ optionsSuccessStatus: 200 }));

// Base route
app.get('/', (req, res) => {
  res.send('File Metadata Microservice is running!');
});

// Endpoint: POST /api/fileanalyse
// freeCodeCamp expects the form input field name to be 'upfile'
app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  if (!req.file) {
    return res.json({ error: 'Please upload a file' });
  }

  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});