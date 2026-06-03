import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faFileLines } from '@fortawesome/free-regular-svg-icons';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';

function formatSize(bytes) {
  if (!bytes) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/documents/stats')
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar title="Dashboard" />
        <div className="page-body">
          <div className="page-header">
            <div className="page-header-left">
              <h1>Welcome back</h1>
              <p>Here's an overview of your vault</p>
            </div>
          </div>

          {loading ? (
            <div className="spinner" style={{ marginTop: '40px' }} />
          ) : (
            <>
              {/* Stats */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon purple">
                    <FontAwesomeIcon icon={faFile} />
                  </div>
                  <div className="stat-info">
                    <div className="stat-value">{stats?.totalDocs ?? 0}</div>
                    <div className="stat-label">Total Documents</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon green">
                    <FontAwesomeIcon icon={faFolderOpen} />
                  </div>
                  <div className="stat-info">
                    <div className="stat-value">{stats?.totalFolders ?? 0}</div>
                    <div className="stat-label">Total Folders</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon orange">
                    <FontAwesomeIcon icon={faFolderOpen} />
                  </div>
                  <div className="stat-info">
                    <div className="stat-value">{formatSize(stats?.totalStorage)}</div>
                    <div className="stat-label">Storage Used</div>
                  </div>
                </div>
              </div>

              {/* Recent Uploads */}
              <div className="card">
                <div className="section-header">
                  <span className="section-title">Recent Uploads</span>
                </div>
                {stats?.recentUploads?.length === 0 ? (
                  <div className="empty-state" style={{ padding: '28px' }}>
                    <div className="empty-icon">📭</div>
                    <p>No documents uploaded yet</p>
                    <div className="empty-sub">Go to My Vault to upload your first document</div>
                  </div>
                ) : (
                  <div className="doc-list">
                    {stats?.recentUploads?.map(doc => (
                      <div key={doc._id} className="doc-card">
                        <div className="doc-icon">
                          <FontAwesomeIcon icon={faFileLines} style={{ fontSize: '22px', color: 'var(--accent)' }} />
                        </div>
                        <div className="doc-info">
                          <div className="doc-title">{doc.title}</div>
                          <div className="doc-meta">{formatSize(doc.fileSize)} · {formatDate(doc.createdAt)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
