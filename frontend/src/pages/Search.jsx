import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import DocumentCard from '../components/DocumentCard';
import api from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderClosed } from '@fortawesome/free-regular-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await api.get(`/documents/search?q=${encodeURIComponent(query)}`);
      setResults(res.data);
    } catch {
      setResults({ documents: [], folders: [] });
    } finally {
      setLoading(false);
    }
  };

  const onDocDelete = (id) => {
    setResults(prev => ({ ...prev, documents: prev.documents.filter(d => d._id !== id) }));
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar title="Search" />
        <div className="page-body">
          <div className="page-header">
            <div className="page-header-left">
              <h1>Search</h1>
              <p>Search documents and folders in your vault</p>
            </div>
          </div>

          <form onSubmit={handleSearch}>
            <div className="search-bar">
              <span className="search-icon">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search documents or folders..."
                autoFocus
              />
              <button className="btn btn-primary btn-sm" type="submit">Search</button>
            </div>
          </form>

          {loading && <div className="spinner" />}

          {results && !loading && (
            <>
              {/* Folder results */}
              {results.folders?.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <div className="section-header">
                    <span className="section-title">Folders ({results.folders.length})</span>
                  </div>
                  <div className="folder-grid">
                    {results.folders.map(f => (
                      <div key={f._id} className="folder-card" onClick={() => navigate(`/vault/folder/${f._id}`)}>
                        <div className="folder-icon">📁</div>
                        <div className="folder-name">{f.name}</div>
                        <div className="folder-meta">{new Date(f.createdAt).toLocaleDateString('en-IN')}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Document results */}
              <div>
                <div className="section-header">
                  <span className="section-title">Documents ({results.documents?.length ?? 0})</span>
                </div>
                {results.documents?.length === 0 && results.folders?.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon" style={{ fontSize: '32px', color: 'var(--text-muted)' }}>
                      <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </div>
                    <p>No results for "{query}"</p>
                    <div className="empty-sub">Try a different search term</div>
                  </div>
                ) : (
                  <div className="doc-list">
                    {results.documents?.map(doc => (
                      <div key={doc._id}>
                        {doc.folderId && (
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', paddingLeft: '4px' }}>
                            📁 {doc.folderId.name}
                          </div>
                        )}
                        <DocumentCard doc={doc} onDelete={onDocDelete} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {!results && !loading && (
            <div className="empty-state">
              <div className="empty-icon" style={{ fontSize: '32px', color: 'var(--text-muted)' }}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </div>
              <p>Start searching your vault</p>
              <div className="empty-sub">Enter a document title or folder name above</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
