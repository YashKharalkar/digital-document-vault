import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import DocumentCard from '../components/DocumentCard';
import UploadModal from '../components/UploadModal';
import ConfirmModal from '../components/ConfirmModal';
import api from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderClosed } from '@fortawesome/free-regular-svg-icons';
import { faUpload, faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
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
  const [confirmDelete, setConfirmDelete] = useState(null);
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

  const handleDeleteConfirmed = async () => {
    if (!confirmDelete) return;
    try {
      await api.delete(`/folders/${confirmDelete._id}`);
      setFolders(prev => prev.filter(f => f._id !== confirmDelete._id));
      toast('Folder deleted');
    } catch {
      toast('Failed to delete folder', 'error');
    } finally {
      setConfirmDelete(null);
    }
  };

  const onDocDelete = (id) => setRootDocs(prev => prev.filter(d => d._id !== id));

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar title="My Vault" />
        <div className="page-body">
          <div className="page-header">
            <div className="page-header-left">
              <h1>My Vault</h1>
              <p>Your personal document storage</p>
            </div>
            <div className="action-row" style={{ margin: 0 }}>
              <button className="btn btn-primary" onClick={() => setShowUpload(true)}>
                <FontAwesomeIcon icon={faUpload} /> Upload Document
              </button>
              <button className="btn btn-secondary" onClick={() => setShowNewFolder(true)}>
                <FontAwesomeIcon icon={faFolderClosed} /> New Folder
              </button>
            </div>
          </div>

          {/* New Folder inline form */}
          {showNewFolder && (
            <div className="card" style={{ marginBottom: '18px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <FontAwesomeIcon icon={faFolderClosed} style={{ color: 'var(--text-muted)', fontSize: '16px' }} />
              <input
                style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '6px', padding: '7px 11px', color: 'var(--text-primary)', fontSize: '13px' }}
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
            <div className="spinner" style={{ marginTop: '40px' }} />
          ) : (
            <>
              {/* Folders */}
              {folders.length > 0 && (
                <div className="folders-section">
                  <div className="section-header">
                    <span className="section-title">Folders ({folders.length})</span>
                  </div>
                  <div className="folder-grid">
                    {folders.map(folder => (
                      <div key={folder._id} className="folder-card">
                        {editingFolder?._id === folder._id ? (
                          <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <input
                              style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--accent)', borderRadius: '5px', padding: '4px 8px', color: 'var(--text-primary)', fontSize: '12px' }}
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
                              <button className="icon-btn" title="Rename" onClick={(e) => { e.stopPropagation(); setEditingFolder(folder); setEditName(folder.name); }}>
                                <FontAwesomeIcon icon={faPen} />
                              </button>
                              <button className="icon-btn danger" title="Delete" onClick={(e) => { e.stopPropagation(); setConfirmDelete(folder); }}>
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
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
                  <span className="section-title">Documents in Vault ({rootDocs.length})</span>
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
        </div>

        {showUpload && (
          <UploadModal
            folders={folders}
            onClose={() => setShowUpload(false)}
            onSuccess={() => { setShowUpload(false); fetchData(); }}
          />
        )}
        {confirmDelete && (
          <ConfirmModal
            title="Delete Folder"
            message={`Delete "${confirmDelete.name}" and all documents inside it? This cannot be undone.`}
            confirmLabel="Delete Folder"
            onConfirm={handleDeleteConfirmed}
            onCancel={() => setConfirmDelete(null)}
          />
        )}
      </main>
    </div>
  );
}
