import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Activity,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  History,
  PlusCircle,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMenus}>
          <div className="navbar-logo-icon">
            <Activity size={22} color="#ffffff" />
          </div>
          <span className="navbar-brand-text">
            Mind<span className="text-primary">Pulse</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="navbar-nav desktop-only" aria-label="Main navigation">
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/assessment"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            New Assessment
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/history"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                History
              </NavLink>
            </>
          )}
        </nav>

        {/* Desktop User Actions */}
        <div className="navbar-actions desktop-only">
          {isAuthenticated ? (
            <div className="user-dropdown-container">
              <button
                type="button"
                className="user-profile-btn"
                onClick={() => setUserDropdownOpen((prev) => !prev)}
                aria-expanded={userDropdownOpen}
                aria-haspopup="true"
              >
                <div className="user-avatar-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="user-name-text">{user?.name || 'User'}</span>
                <ChevronDown size={14} className="text-muted" />
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="dropdown-overlay"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="user-dropdown-menu" role="menu">
                    <div className="dropdown-user-header">
                      <p className="dropdown-user-name">{user?.name}</p>
                      <p className="dropdown-user-email">{user?.email}</p>
                    </div>
                    <div className="dropdown-divider" />
                    <Link
                      to="/dashboard"
                      className="dropdown-item"
                      onClick={closeMenus}
                      role="menuitem"
                    >
                      <LayoutDashboard size={16} />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/assessment"
                      className="dropdown-item"
                      onClick={closeMenus}
                      role="menuitem"
                    >
                      <PlusCircle size={16} />
                      <span>New Assessment</span>
                    </Link>
                    <Link
                      to="/history"
                      className="dropdown-item"
                      onClick={closeMenus}
                      role="menuitem"
                    >
                      <History size={16} />
                      <span>History</span>
                    </Link>
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={closeMenus}
                      role="menuitem"
                    >
                      <User size={16} />
                      <span>Profile Settings</span>
                    </Link>
                    <div className="dropdown-divider" />
                    <button
                      type="button"
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                      role="menuitem"
                    >
                      <LogOut size={16} />
                      <span>Log out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="auth-buttons-group">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
              >
                Log In
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="mobile-only">
          <button
            type="button"
            className="hamburger-btn"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer" role="dialog" aria-modal="true">
          <nav className="mobile-nav-links">
            <Link to="/" className="mobile-nav-link" onClick={closeMenus}>
              Home
            </Link>
            <Link to="/assessment" className="mobile-nav-link" onClick={closeMenus}>
              New Assessment
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="mobile-nav-link" onClick={closeMenus}>
                  Dashboard
                </Link>
                <Link to="/history" className="mobile-nav-link" onClick={closeMenus}>
                  History
                </Link>
                <Link to="/profile" className="mobile-nav-link" onClick={closeMenus}>
                  Profile Settings
                </Link>
                <div className="mobile-nav-divider" />
                <button
                  type="button"
                  className="mobile-nav-link text-danger w-full text-left"
                  onClick={handleLogout}
                >
                  <LogOut size={16} style={{ display: 'inline', marginRight: '8px' }} />
                  Log Out ({user?.name})
                </button>
              </>
            ) : (
              <div className="mobile-auth-actions">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    closeMenus();
                    navigate('/login');
                  }}
                >
                  Log In
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    closeMenus();
                    navigate('/register');
                  }}
                >
                  Get Started
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
