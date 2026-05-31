const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Folder = require('../models/Folder');
const Document = require('../models/Document');

// All routes require authentication
router.use(auth);

// GET /api/folders — list all folders for current user
router.get('/', async (req, res) => {
  try {
    const folders = await Folder.find({ owner: req.userId }).sort({ createdAt: 1 });
    res.json(folders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/folders — create a new folder
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: 'Folder name is required' });

    const folder = await Folder.create({ name: name.trim(), owner: req.userId });
    res.status(201).json(folder);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/folders/:id — rename folder
router.put('/:id', async (req, res) => {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, owner: req.userId });
    if (!folder) return res.status(404).json({ message: 'Folder not found' });

    folder.name = req.body.name.trim();
    await folder.save();
    res.json(folder);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/folders/:id — delete folder and its documents
router.delete('/:id', async (req, res) => {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, owner: req.userId });
    if (!folder) return res.status(404).json({ message: 'Folder not found' });

    // Delete all documents inside this folder
    await Document.deleteMany({ folderId: folder._id });

    await folder.deleteOne();
    res.json({ message: 'Folder deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/folders/:id/documents — get documents inside a folder
router.get('/:id/documents', async (req, res) => {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, owner: req.userId });
    if (!folder) return res.status(404).json({ message: 'Folder not found' });

    const documents = await Document.find({ folderId: folder._id }).sort({ createdAt: -1 });
    res.json({ folder, documents });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
