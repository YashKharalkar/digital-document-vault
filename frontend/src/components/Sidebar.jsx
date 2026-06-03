import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar } from '@fortawesome/free-regular-svg-icons';
import { faMagnifyingGlass, faWallet, faFileShield } from '@fortawesome/free-solid-svg-icons';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon" style={{ background: '#38bdf8' }}>
          <FontAwesomeIcon icon={faFileShield} style={{ color: '#fff', fontSize: '16px' }} />
        </div>
        <div className="logo-text">My<span>Vault</span></div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main Menu</div>

        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
          <FontAwesomeIcon icon={faChartBar} className="nav-icon" />
          Dashboard
        </NavLink>

        <NavLink to="/vault" className={({ isActive }) => isActive ? 'active' : ''}>
          <FontAwesomeIcon icon={faWallet} className="nav-icon" />
          My Vault
        </NavLink>

        <NavLink to="/search" className={({ isActive }) => isActive ? 'active' : ''}>
          <FontAwesomeIcon icon={faMagnifyingGlass} className="nav-icon" />
          Search
        </NavLink>
      </nav>
    </aside>
  );
}
