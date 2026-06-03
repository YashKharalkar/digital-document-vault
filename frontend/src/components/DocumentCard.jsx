import { useState } from 'react';
import api from '../api';
import { toast } from './Toast';
import ConfirmModal from './ConfirmModal';

const FILE_ICONS = {
  'application/pdf': '📕',
  'image/jpeg': '🖼️', 'image/png': '🖼️', 'image/gif': '🖼️', 'image/webp': '🖼️',
  'application/msword': '📘',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📘',
};

function formatSize(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function DocumentCard({ doc, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const icon = FILE_ICONS[doc.mimeType] || '📄';

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/share/${doc.shareToken}`;
    navigator.clipboard.writeText(shareUrl);
    toast('Share link copied to clipboard!');
  };

  const handleDeleteConfirmed = async () => {
    try {
      await api.delete(`/documents/${doc._id}`);
      toast('Document deleted');
      onDelete(doc._id);
    } catch {
      toast('Failed to delete document', 'error');
    } finally {
      setShowConfirm(false);
    }
  };

  const handleDownload = () => {
    window.open(`/uploads/${doc.filepath}`, '_blank');
  };

  return (
    <>
      <div className="doc-card">
        <div className="doc-icon">{icon}</div>
        <div className="doc-info">
          <div className="doc-title">{doc.title}</div>
          <div className="doc-meta">{formatSize(doc.fileSize)} · {formatDate(doc.createdAt)}{doc.description && ` · ${doc.description}`}</div>
        </div>
        <div className="doc-actions">
          <button className="icon-btn" onClick={handleDownload} title="Download">⬇️</button>
          <button className="icon-btn" onClick={handleShare} title="Copy share link">🔗</button>
          <button className="icon-btn danger" onClick={() => setShowConfirm(true)} title="Delete">🗑️</button>
        </div>
      </div>

      {showConfirm && (
        <ConfirmModal
          title="🗑️ Delete Document"
          message={`Delete "${doc.title}"? This cannot be undone.`}
          confirmLabel="Delete Document"
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
