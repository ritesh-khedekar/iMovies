import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FiFilm, FiMenu, FiX, FiUser, FiLogOut, FiShield, FiTag, FiCompass } from 'react-icons/fi';
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
        backgroundColor: 'rgba(11, 13, 20, 0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.35)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: '76px' }}>
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginRight: '36px',
            textDecoration: 'none',
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '11px',
              background: 'linear-gradient(135deg, #FF334B 0%, #E50914 60%, #990008 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 20px rgba(229, 9, 20, 0.45)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <FiFilm size={22} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '22px',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                color: '#FFFFFF',
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              I<span style={{ color: 'var(--accent-light)' }}>MOVIES</span>
            </span>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
              }}
            >
              Cinemas
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="d-none d-md-flex align-items-center gap-12 me-auto">
          <NavLink
            to="/"
            style={({ isActive }) => ({
              fontSize: '14.5px',
              fontWeight: 600,
              color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
              padding: '9px 16px',
              borderRadius: '10px',
              backgroundColor: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              border: isActive ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid transparent',
              boxShadow: isActive ? '0 4px 15px rgba(0, 0, 0, 0.2)' : 'none',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            })}
          >
            <FiCompass size={16} />
            <span>Discover</span>
          </NavLink>

          {user && (
            <NavLink
              to="/my-bookings"
              style={({ isActive }) => ({
                fontSize: '14.5px',
                fontWeight: 600,
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                padding: '9px 16px',
                borderRadius: '10px',
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                border: isActive ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid transparent',
                boxShadow: isActive ? '0 4px 15px rgba(0, 0, 0, 0.2)' : 'none',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              })}
            >
              <FiTag size={16} />
              <span>My Tickets</span>
            </NavLink>
          )}

          {isAdmin && (
            <NavLink
              to="/admin"
              style={({ isActive }) => ({
                fontSize: '14.5px',
                fontWeight: 600,
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                padding: '9px 16px',
                borderRadius: '10px',
                backgroundColor: isActive ? 'rgba(229, 9, 20, 0.15)' : 'transparent',
                border: isActive ? '1px solid rgba(229, 9, 20, 0.35)' : '1px solid transparent',
                boxShadow: isActive ? '0 4px 15px rgba(229, 9, 20, 0.25)' : 'none',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              })}
            >
              <FiShield size={16} style={{ color: 'var(--accent-light)' }} />
              <span>Studio Admin</span>
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
                  backgroundColor: 'rgba(23, 29, 46, 0.75)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '100px',
                  padding: '5px 14px 5px 6px',
                  cursor: 'pointer',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
                  transition: 'all 0.25s ease',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isAdmin
                      ? 'linear-gradient(135deg, #FFB800 0%, #E65100 100%)'
                      : 'linear-gradient(135deg, #FF334B 0%, #E50914 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, lineHeight: 1.2 }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: '10.5px', color: isAdmin ? '#FCD34D' : 'var(--text-tertiary)', fontWeight: 600 }}>
                    {isAdmin ? 'ADMINISTRATOR' : 'VIP MEMBER'}
                  </div>
                </div>
              </button>

              {dropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    width: '230px',
                    backgroundColor: '#131724',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '14px',
                    padding: '10px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.65), 0 0 20px rgba(229, 9, 20, 0.15)',
                    zIndex: 100,
                    animation: 'modalScale 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '6px' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#FFFFFF' }}>{user.name}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.email}
                    </div>
                  </div>

                  <Link
                    to="/my-bookings"
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 12px',
                      fontSize: '13.5px',
                      fontWeight: 500,
                      borderRadius: '8px',
                      color: 'var(--text-secondary)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
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
                        gap: '10px',
                        padding: '9px 12px',
                        fontSize: '13.5px',
                        fontWeight: 500,
                        borderRadius: '8px',
                        color: 'var(--text-secondary)',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                        e.currentTarget.style.color = '#FFFFFF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }}
                    >
                      <FiShield size={16} />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)', margin: '6px 0' }} />

                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 12px',
                      fontSize: '13.5px',
                      fontWeight: 600,
                      borderRadius: '8px',
                      color: '#F87171',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <FiLogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login">
                <Button variant="outline" size="sm" style={{ borderRadius: '100px', padding: '8px 18px' }}>
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm" style={{ borderRadius: '100px', padding: '8px 20px' }}>
                  Get Started
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
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            color: '#FFFFFF',
            padding: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="d-md-none"
          style={{
            backgroundColor: '#101420',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            boxShadow: '0 20px 30px rgba(0, 0, 0, 0.5)',
          }}
        >
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '12px 16px',
              fontSize: '15px',
              fontWeight: 600,
              color: '#FFFFFF',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
            }}
          >
            Discover Movies
          </NavLink>

          {user && (
            <NavLink
              to="/my-bookings"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: '12px 16px',
                fontSize: '15px',
                fontWeight: 600,
                color: '#FFFFFF',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
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
                padding: '12px 16px',
                fontSize: '15px',
                fontWeight: 600,
                color: '#FFFFFF',
                borderRadius: '10px',
                backgroundColor: 'rgba(229, 9, 20, 0.12)',
              }}
            >
              Admin Dashboard
            </NavLink>
          )}

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px', marginTop: '6px' }}>
            {user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Signed in as <strong>{user.name}</strong> ({user.email})
                </div>
                <Button variant="danger" size="sm" onClick={handleLogout} icon={<FiLogOut />}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link to="/login" style={{ flex: 1 }} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" style={{ width: '100%', borderRadius: '100px' }}>
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" style={{ flex: 1 }} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" style={{ width: '100%', borderRadius: '100px' }}>
                    Get Started
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
