import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

const FILE_ICONS = {
  'application/pdf': '📕',
  'image/jpeg': '🖼️', 'image/png': '🖼️', 'image/gif': '🖼️', 'image/webp': '🖼️',
  'application/msword': '📘',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📘',
};

function formatSize(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function ShareView() {
  const { token } = useParams();
  const [doc, setDoc] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Just display info — the actual download is via /api/share/:token
    // We need to fetch doc metadata; use a lightweight approach
    // Since the share route downloads directly, we'll just show a download prompt
    setLoading(false);
    setDoc({ token }); // minimal state, real content served from backend
  }, [token]);

  const downloadUrl = `/api/share/${token}`;

  return (
    <div className="share-page">
      <div className="share-card">
        <div className="share-icon">🔗</div>
        <h2>Shared Document</h2>
        <p>Someone shared a document with you via MyVault. Click the button below to download it.</p>
        <a href={downloadUrl} className="btn btn-primary" style={{ display: 'inline-flex', justifyContent: 'center' }}>
          ⬇️ Download Document
        </a>
        <div style={{ marginTop: '20px', fontSize: '12px', color: 'var(--text-muted)' }}>
          Powered by <strong style={{ color: 'var(--accent)' }}>MyVault</strong>
        </div>
      </div>
    </div>
  );
}
