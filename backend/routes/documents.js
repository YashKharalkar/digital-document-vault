const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const Document = require('../models/Document');
const Folder = require('../models/Folder');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, images, and Word documents are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, 
});

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const { folderId } = req.query;
    const query = { uploadedBy: req.userId };

    if (folderId === 'null' || folderId === '') {
      query.folderId = null; 
    } else if (folderId) {
      query.folderId = folderId;
    }

    const documents = await Document.find(query).sort({ createdAt: -1 });
    res.json(documents);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const totalDocs = await Document.countDocuments({ uploadedBy: req.userId });
    const totalFolders = await Folder.countDocuments({ owner: req.userId });
    const recentUploads = await Document.find({ uploadedBy: req.userId })
      .sort({ createdAt: -1 })
      .limit(5);
    const allDocs = await Document.find({ uploadedBy: req.userId }, 'fileSize');
    const totalStorage = allDocs.reduce((sum, d) => sum + (d.fileSize || 0), 0);

    res.json({ totalDocs, totalFolders, recentUploads, totalStorage });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const documents = await Document.find({
      uploadedBy: req.userId,
      title: { $regex: q, $options: 'i' },
    })
      .populate('folderId', 'name')
      .sort({ createdAt: -1 });

    const folders = await Folder.find({
      owner: req.userId,
      name: { $regex: q, $options: 'i' },
    });

    res.json({ documents, folders });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const { title, description, folderId } = req.body;

    if (folderId) {
      const folder = await Folder.findOne({ _id: folderId, owner: req.userId });
      if (!folder) return res.status(404).json({ message: 'Folder not found' });
    }

    const doc = await Document.create({
      title: title || req.file.originalname,
      description: description || '',
      filename: req.file.originalname,
      filepath: req.file.filename,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      uploadedBy: req.userId,
      folderId: folderId || null,
    });

    res.status(201).json(doc);
  } catch (err) {
    if (err.message.includes('Invalid file type') || err.message.includes('File too large')) {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const doc = await Document.findOne({ _id: req.params.id, uploadedBy: req.userId });
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const filePath = path.join(uploadsDir, doc.filepath);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await doc.deleteOne();
    res.json({ message: 'Document deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
