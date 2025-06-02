import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = "Season events" }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link to="/dashboard" className="sidebar-brand">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 1.09-.21 2.28-.71 3.33-1.36.51-.31.97-.66 1.39-1.06.21-.2.4-.4.58-.62.37-.42.71-.87 1.01-1.35.59-.94 1.07-1.96 1.42-3.05.18-.55.33-1.12.44-1.69.06-.3.11-.6.15-.91.03-.21.05-.43.06-.65.01-.11.01-.22.01-.33V7L12 2z"/>
            </svg>
            Events
          </Link>
        </div>
        <nav>
          <ul className="sidebar-nav">
            <li className="sidebar-nav-item">
              <Link 
                to="/dashboard" 
                className={`sidebar-nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
                Booking Schedule
              </Link>
            </li>
            <li className="sidebar-nav-item">
              <Link 
                to="/events" 
                className={`sidebar-nav-link ${isActive('/events') ? 'active' : ''}`}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
                </svg>
                Events
              </Link>
            </li>

            <li className="sidebar-nav-item">
              <Link
                to="/categories"
                className={`sidebar-nav-link ${isActive('/categories') ? 'active' : ''}`}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Categories
              </Link>
            </li>
            <li className="sidebar-nav-item">
              <Link
                to="/profile"
                className={`sidebar-nav-link ${isActive('/profile') ? 'active' : ''}`}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                Profile Update
              </Link>
            </li>
          </ul>
        </nav>
        <div style={{ marginTop: 'auto', padding: '20px', borderTop: '1px solid #e9ecef' }}>
          <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%' }}>
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}>
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
            Log Out
          </button>
        </div>
      </aside>
      
      <main className="main-content">
        <header className="top-navbar">
          <div className="page-header">
            <h1 className="page-title">{title}</h1>
          </div>
          <div className="user-menu">
            <div className="user-info">
              <div className="user-avatar">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <span>Welcome, {user?.username}</span>
            </div>
          </div>
        </header>
        
        <div className="content-area">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
