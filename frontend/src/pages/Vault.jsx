import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DocumentCard from '../components/DocumentCard';
import UploadModal from '../components/UploadModal';
import api from '../api';
import { toast } from '../components/Toast';

export default function Vault() {
  const [folders, setFolders] = useState([]);
  const [rootDocs, setRootDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolder, setEditingFolder] = useState(null);
  const [editName, setEditName] = useState('');
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [foldersRes, docsRes] = await Promise.all([
        api.get('/folders'),
        api.get('/documents?folderId=null'),
      ]);
      setFolders(foldersRes.data);
      setRootDocs(docsRes.data);
    } catch (err) {
      toast('Failed to load vault', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const res = await api.post('/folders', { name: newFolderName.trim() });
      setFolders(prev => [...prev, res.data]);
      setNewFolderName('');
      setShowNewFolder(false);
      toast('Folder created!');
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to create folder', 'error');
    }
  };

  const renameFolder = async (folder) => {
    if (!editName.trim()) return;
    try {
      const res = await api.put(`/folders/${folder._id}`, { name: editName.trim() });
      setFolders(prev => prev.map(f => f._id === folder._id ? res.data : f));
      setEditingFolder(null);
      toast('Folder renamed!');
    } catch {
      toast('Failed to rename folder', 'error');
    }
  };

  const deleteFolder = async (folder) => {
    if (!window.confirm(`Delete folder "${folder.name}" and all its documents?`)) return;
    try {
      await api.delete(`/folders/${folder._id}`);
      setFolders(prev => prev.filter(f => f._id !== folder._id));
      toast('Folder deleted');
    } catch {
      toast('Failed to delete folder', 'error');
    }
  };

  const onDocDelete = (id) => setRootDocs(prev => prev.filter(d => d._id !== id));

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>🗃️ My Vault</h1>
          <p>Your personal document storage</p>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => setShowUpload(true)}>📤 Upload Document</button>
          <button className="btn btn-secondary" onClick={() => setShowNewFolder(true)}>📁 New Folder</button>
        </div>

        {/* New Folder inline form */}
        {showNewFolder && (
          <div className="card" style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span>📁</span>
            <input
              style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 12px', color: 'var(--text-primary)', fontSize: '14px' }}
              placeholder="Folder name..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createFolder()}
              autoFocus
            />
            <button className="btn btn-primary btn-sm" onClick={createFolder}>Create</button>
            <button className="btn btn-secondary btn-sm" onClick={() => { setShowNewFolder(false); setNewFolderName(''); }}>Cancel</button>
          </div>
        )}

        {loading ? (
          <div className="spinner" style={{ marginTop: '40px' }}></div>
        ) : (
          <>
            {/* Folders */}
            {folders.length > 0 && (
              <div className="folders-section">
                <div className="section-header">
                  <span className="section-title">📁 Folders ({folders.length})</span>
                </div>
                <div className="folder-grid">
                  {folders.map(folder => (
                    <div key={folder._id} className="folder-card">
                      {editingFolder?._id === folder._id ? (
                        <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <input
                            style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--accent)', borderRadius: '6px', padding: '4px 8px', color: 'var(--text-primary)', fontSize: '13px' }}
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && renameFolder(folder)}
                            autoFocus
                          />
                          <button className="btn btn-primary btn-sm" onClick={() => renameFolder(folder)}>✓</button>
                          <button className="btn btn-secondary btn-sm" onClick={() => setEditingFolder(null)}>✕</button>
                        </div>
                      ) : (
                        <>
                          <div className="folder-actions">
                            <button className="icon-btn" title="Rename" onClick={(e) => { e.stopPropagation(); setEditingFolder(folder); setEditName(folder.name); }}>✏️</button>
                            <button className="icon-btn danger" title="Delete" onClick={(e) => { e.stopPropagation(); deleteFolder(folder); }}>🗑️</button>
                          </div>
                          <div onClick={() => navigate(`/vault/folder/${folder._id}`)}>
                            <div className="folder-icon">📁</div>
                            <div className="folder-name">{folder.name}</div>
                            <div className="folder-meta">{new Date(folder.createdAt).toLocaleDateString('en-IN')}</div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Root Documents */}
            <div>
              <div className="section-header">
                <span className="section-title">📄 Documents in Vault ({rootDocs.length})</span>
              </div>
              {rootDocs.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <p>No documents in vault root</p>
                  <div className="empty-sub">Upload a document or open a folder</div>
                </div>
              ) : (
                <div className="doc-list">
                  {rootDocs.map(doc => (
                    <DocumentCard key={doc._id} doc={doc} onDelete={onDocDelete} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {showUpload && (
          <UploadModal
            folders={folders}
            onClose={() => setShowUpload(false)}
            onSuccess={() => { setShowUpload(false); fetchData(); }}
          />
        )}
      </main>
    </div>
  );
}
