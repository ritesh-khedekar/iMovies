import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FiFilm, FiMenu, FiX, FiSearch, FiUser, FiLogOut, FiShield, FiTag } from 'react-icons/fi';
import Button from './ui/Button';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    success('Signed out successfully');
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'var(--bg-main)',
        borderBottom: '1px solid var(--border-color)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: '72px' }}>
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginRight: '32px',
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
            }}
          >
            <FiFilm size={20} />
          </div>
          <span style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            I<span style={{ color: 'var(--accent)' }}>MOVIES</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="d-none d-md-flex align-items-center gap-16 me-auto">
          <NavLink
            to="/"
            style={({ isActive }) => ({
              fontSize: '15px',
              fontWeight: 500,
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              padding: '8px 12px',
              borderRadius: '6px',
              backgroundColor: isActive ? 'var(--bg-surface)' : 'transparent',
              border: isActive ? '1px solid var(--border-color)' : '1px solid transparent',
            })}
          >
            Movies
          </NavLink>

          {user && (
            <NavLink
              to="/my-bookings"
              style={({ isActive }) => ({
                fontSize: '15px',
                fontWeight: 500,
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                padding: '8px 12px',
                borderRadius: '6px',
                backgroundColor: isActive ? 'var(--bg-surface)' : 'transparent',
                border: isActive ? '1px solid var(--border-color)' : '1px solid transparent',
              })}
            >
              My Bookings
            </NavLink>
          )}

          {isAdmin && (
            <NavLink
              to="/admin"
              style={({ isActive }) => ({
                fontSize: '15px',
                fontWeight: 500,
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                padding: '8px 12px',
                borderRadius: '6px',
                backgroundColor: isActive ? 'var(--bg-surface)' : 'transparent',
                border: isActive ? '1px solid var(--border-color)' : '1px solid transparent',
              })}
            >
              Admin Dashboard
            </NavLink>
          )}
        </nav>

        {/* Right Auth Controls */}
        <div className="d-none d-md-flex align-items-center gap-16">
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  color: 'var(--text-primary)',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: isAdmin ? 'var(--bg-surface-alt)' : 'var(--accent)',
                    border: isAdmin ? '1px solid var(--border-color)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{user.name}</span>
              </button>

              {dropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    width: '200px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '8px',
                    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.4)',
                    zIndex: 100,
                  }}
                >
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-color)', marginBottom: '4px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{user.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{user.email}</div>
                  </div>

                  <Link
                    to="/my-bookings"
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      fontSize: '14px',
                      borderRadius: '6px',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <FiTag size={16} />
                    <span>My Bookings</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        fontSize: '14px',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <FiShield size={16} />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      fontSize: '14px',
                      borderRadius: '6px',
                      color: 'var(--danger)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <FiLogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="d-md-none ms-auto"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            padding: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="d-md-none"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-color)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '10px 14px',
              fontSize: '15px',
              color: 'var(--text-primary)',
              borderRadius: '6px',
            }}
          >
            Movies
          </NavLink>

          {user && (
            <NavLink
              to="/my-bookings"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: '10px 14px',
                fontSize: '15px',
                color: 'var(--text-primary)',
                borderRadius: '6px',
              }}
            >
              My Bookings
            </NavLink>
          )}

          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: '10px 14px',
                fontSize: '15px',
                color: 'var(--text-primary)',
                borderRadius: '6px',
              }}
            >
              Admin Dashboard
            </NavLink>
          )}

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '4px' }}>
            {user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ padding: '4px 14px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Signed in as <strong>{user.name}</strong>
                </div>
                <Button variant="danger" size="sm" onClick={handleLogout} icon={<FiLogOut />}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link to="/login" style={{ flex: 1 }} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" style={{ width: '100%' }}>
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" style={{ flex: 1 }} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" style={{ width: '100%' }}>
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
