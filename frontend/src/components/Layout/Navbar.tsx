import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/dashboard" className="navbar-brand">
          Event Scheduler
        </Link>
        <ul className="navbar-nav">
          <li>
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/calendar" className="nav-link">
              Calendar
            </Link>
          </li>
          <li>
            <Link to="/events" className="nav-link">
              Events
            </Link>
          </li>
          <li>
            <Link to="/events/new" className="nav-link">
              New Event
            </Link>
          </li>
          <li>
            <span className="nav-link">Welcome, {user?.username}</span>
          </li>
          <li>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
