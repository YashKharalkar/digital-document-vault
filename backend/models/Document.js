const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  filename: { type: String, required: true },
  filepath: { type: String, required: true },
  fileSize: { type: Number, default: 0 },
  mimeType: { type: String, default: '' },
  shareToken: { type: String, default: () => uuidv4(), unique: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', DocumentSchema);
