const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');

// GET /api/share/:token — public shared document download (no auth required)
router.get('/:token', async (req, res) => {
  try {
    const doc = await Document.findOne({ shareToken: req.params.token });
    if (!doc) return res.status(404).json({ message: 'Document not found or link is invalid' });

    const filePath = path.join(__dirname, '..', 'uploads', doc.filepath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    // Send file for download
    res.download(filePath, doc.filename);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
