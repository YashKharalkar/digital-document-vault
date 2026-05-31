import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DocumentCard from '../components/DocumentCard';
import api from '../api';

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
        <div className="page-header">
          <h1>🔍 Search</h1>
          <p>Search documents and folders in your vault</p>
        </div>

        <form onSubmit={handleSearch}>
          <div className="search-bar" style={{ marginBottom: '28px' }}>
            <span className="search-icon">🔍</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search documents or folders..."
              autoFocus
            />
            <button className="btn btn-primary btn-sm" type="submit">Search</button>
          </div>
        </form>

        {loading && <div className="spinner"></div>}

        {results && !loading && (
          <>
            {/* Folder results */}
            {results.folders?.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <div className="section-title" style={{ marginBottom: '12px' }}>
                  📁 Folders ({results.folders.length})
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
              <div className="section-title" style={{ marginBottom: '12px' }}>
                📄 Documents ({results.documents?.length ?? 0})
              </div>
              {results.documents?.length === 0 && results.folders?.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🔎</div>
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
            <div className="empty-icon">🔍</div>
            <p>Start searching your vault</p>
            <div className="empty-sub">Enter a document title or folder name above</div>
          </div>
        )}
      </main>
    </div>
  );
}
