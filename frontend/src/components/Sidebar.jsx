import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🗄️</div>
        <div className="logo-text">My<span>Vault</span></div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="nav-icon">📊</span> Dashboard
        </NavLink>
        <NavLink to="/vault" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="nav-icon">🗃️</span> My Vault
        </NavLink>
        <NavLink to="/search" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="nav-icon">🔍</span> Search
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="user-pill">
          <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <div className="user-email">{user?.email}</div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">↩</button>
        </div>
      </div>
    </aside>
  );
}
