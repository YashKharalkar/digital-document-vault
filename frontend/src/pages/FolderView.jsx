import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import DocumentCard from '../components/DocumentCard';
import UploadModal from '../components/UploadModal';
import api from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { toast } from '../components/Toast';

export default function FolderView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [folder, setFolder] = useState(null);
  const [allFolders, setAllFolders] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [folderRes, allFoldersRes] = await Promise.all([
        api.get(`/folders/${id}/documents`),
        api.get('/folders'),
      ]);
      setFolder(folderRes.data.folder);
      setDocuments(folderRes.data.documents);
      setAllFolders(allFoldersRes.data);
    } catch {
      toast('Folder not found', 'error');
      navigate('/vault');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const onDocDelete = (docId) => setDocuments(prev => prev.filter(d => d._id !== docId));

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar title={folder?.name || 'Folder'} />
        <div className="page-body">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <span onClick={() => navigate('/vault')}>My Vault</span>
            <span className="sep">›</span>
            <span className="current">📁 {folder?.name || '...'}</span>
          </div>

          <div className="page-header">
            <div className="page-header-left">
              <h1>📁 {folder?.name}</h1>
              <p>{documents.length} document{documents.length !== 1 ? 's' : ''} in this folder</p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowUpload(true)}>
              <FontAwesomeIcon icon={faUpload} /> Upload to this Folder
            </button>
          </div>

          {loading ? (
            <div className="spinner" style={{ marginTop: '40px' }} />
          ) : documents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📂</div>
              <p>This folder is empty</p>
              <div className="empty-sub">Upload a document to get started</div>
            </div>
          ) : (
            <div className="doc-list">
              {documents.map(doc => (
                <DocumentCard key={doc._id} doc={doc} onDelete={onDocDelete} />
              ))}
            </div>
          )}
        </div>

        {showUpload && (
          <UploadModal
            folders={allFolders}
            defaultFolderId={id}
            onClose={() => setShowUpload(false)}
            onSuccess={() => { setShowUpload(false); fetchData(); }}
          />
        )}
      </main>
    </div>
  );
}
