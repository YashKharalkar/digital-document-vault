import { useState } from 'react';
import api from '../api';
import { toast } from './Toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faUpload } from '@fortawesome/free-solid-svg-icons';

export default function UploadModal({ folders, onClose, onSuccess, defaultFolderId }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [folderMode, setFolderMode] = useState(defaultFolderId ? 'existing' : 'root');
  const [selectedFolder, setSelectedFolder] = useState(defaultFolderId || '');
  const [newFolderName, setNewFolderName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) { setFile(dropped); if (!title) setTitle(dropped.name.replace(/\.[^/.]+$/, '')); }
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); if (!title) setTitle(f.name.replace(/\.[^/.]+$/, '')); }
  };

  const handleSubmit = async () => {
    if (!file) return toast('Please select a file', 'error');
    if (!title.trim()) return toast('Please enter a document title', 'error');

    setUploading(true);
    try {
      let folderId = null;

      if (folderMode === 'new') {
        if (!newFolderName.trim()) return toast('Enter a folder name', 'error');
        const res = await api.post('/folders', { name: newFolderName.trim() });
        folderId = res.data._id;
      } else if (folderMode === 'existing' && selectedFolder) {
        folderId = selectedFolder;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      if (folderId) formData.append('folderId', folderId);

      await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast('Document uploaded successfully!');
      onSuccess();
    } catch (err) {
      toast(err.response?.data?.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">
            <FontAwesomeIcon icon={faUpload} style={{ marginRight: '8px' }} /> Upload Document
          </span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Drop Zone */}
        <div
          className={`drop-zone ${dragging ? 'active' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input').click()}
        >
          <div className="drop-icon" style={{ fontSize: '32px', marginBottom: '10px', color: 'var(--accent)' }}>
            {file ? <FontAwesomeIcon icon={faFile} /> : <FontAwesomeIcon icon={faUpload} />}
          </div>
          <p>{file ? file.name : 'Click or drag a file here'}</p>
          <div className="drop-sub">PDF, Images, Word · Max 10 MB</div>
          <input id="file-input" type="file" accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx" onChange={handleFileChange} />
        </div>

        {/* Title */}
        <div className="form-group">
          <label>Document Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title..." />
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description (optional)</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description..." />
        </div>

        {/* Folder Selection */}
        <div className="form-group">
          <label>Save to</label>
          <select className="form-select" value={folderMode} onChange={(e) => setFolderMode(e.target.value)}>
            <option value="root">My Vault (root)</option>
            <option value="existing">Existing folder</option>
            <option value="new">Create new folder</option>
          </select>

          {folderMode === 'existing' && (
            <select className="form-select" value={selectedFolder} onChange={(e) => setSelectedFolder(e.target.value)}>
              <option value="">-- Select a folder --</option>
              {folders.map(f => (
                <option key={f._id} value={f._id}>{f.name}</option>
              ))}
            </select>
          )}

          {folderMode === 'new' && (
            <input
              className="form-select"
              style={{ marginBottom: 0 }}
              placeholder="New folder name..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={uploading}>
            <FontAwesomeIcon icon={faUpload} style={{ marginRight: '6px' }} /> {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}
