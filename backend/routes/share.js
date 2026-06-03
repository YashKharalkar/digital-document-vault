const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');

router.get('/:token', async (req, res) => {
  try {
    const doc = await Document.findOne({ shareToken: req.params.token });
    if (!doc) return res.status(404).json({ message: 'Document not found or link is invalid' });

    const filePath = path.join(__dirname, '..', 'uploads', doc.filepath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    res.download(filePath, doc.filename);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
