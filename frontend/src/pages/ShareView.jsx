import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faDownload } from '@fortawesome/free-solid-svg-icons';

export default function ShareView() {
  const { token } = useParams();
  const [doc, setDoc] = useState(null);

  useEffect(() => {
    setDoc({ token });
  }, [token]);

  const downloadUrl = `/api/share/${token}`;

  return (
    <div className="share-page">
      <div className="share-card">
        <div className="share-icon" style={{ fontSize: '36px', marginBottom: '16px', color: 'var(--accent)' }}>
          <FontAwesomeIcon icon={faLink} />
        </div>
        <h2>Shared Document</h2>
        <p>Someone shared a document with you via MyVault. Click the button below to download it.</p>
        <a href={downloadUrl} className="btn btn-primary" style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          <FontAwesomeIcon icon={faDownload} /> Download Document
        </a>
        <div style={{ marginTop: '20px', fontSize: '12px', color: 'var(--text-muted)' }}>
          Powered by <strong style={{ color: 'var(--accent)' }}>MyVault</strong>
        </div>
      </div>
    </div>
  );
}
