import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';

export default function Topbar({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <header className="topbar">
      <span className="topbar-title">{title}</span>

      <div className="topbar-right">
        <div className="profile-wrapper" ref={ref}>
          <button
            className={`profile-btn${open ? ' open' : ''}`}
            onClick={() => setOpen(v => !v)}
            aria-label="Profile menu"
          >
            <div className="profile-avatar">{initials}</div>
            <span className="profile-name">{user?.name}</span>
            <span className="profile-chevron">▼</span>
          </button>

          {open && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-header">
                <div className="profile-dropdown-name">{user?.name}</div>
                <div className="profile-dropdown-email">{user?.email}</div>
              </div>
              <button
                className="profile-dropdown-item danger"
                onClick={handleLogout}
              >
                <FontAwesomeIcon icon={faArrowRightFromBracket} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
