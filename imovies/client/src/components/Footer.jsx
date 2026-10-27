import React from 'react';
import { Link } from 'react-router-dom';
import { FiFilm, FiShield, FiClock, FiCheckCircle, FiHeart, FiLock } from 'react-icons/fi';
import { FaTwitter, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#0A0C13',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        marginTop: 'auto',
        padding: '56px 0 28px 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: 'absolute',
          top: '-150px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '250px',
          background: 'radial-gradient(ellipse, rgba(229, 9, 20, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Value Proposition Highlights */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            paddingBottom: '44px',
            marginBottom: '44px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '16px 20px',
              borderRadius: '16px',
              background: 'rgba(23, 29, 46, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(229, 9, 20, 0.15)',
                border: '1px solid rgba(229, 9, 20, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-light)',
                flexShrink: 0,
              }}
            >
              <FiShield size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: '#FFFFFF' }}>Guaranteed Booking</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12.5px' }}>Atomic concurrency safe</div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '16px 20px',
              borderRadius: '16px',
              background: 'rgba(23, 29, 46, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--success)',
                flexShrink: 0,
              }}
            >
              <FiCheckCircle size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: '#FFFFFF' }}>Instant Cancellation</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12.5px' }}>1-Click automatic seat release</div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '16px 20px',
              borderRadius: '16px',
              background: 'rgba(23, 29, 46, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(255, 184, 0, 0.15)',
                border: '1px solid rgba(255, 184, 0, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gold)',
                flexShrink: 0,
              }}
            >
              <FiClock size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: '#FFFFFF' }}>Live Seat Sync</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12.5px' }}>Real-time 10s seat polling</div>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '36px',
            marginBottom: '44px',
          }}
        >
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '9px',
                  background: 'linear-gradient(135deg, #FF334B 0%, #E50914 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 14px rgba(229, 9, 20, 0.4)',
                }}
              >
                <FiFilm size={18} />
              </div>
              <span style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                I<span style={{ color: 'var(--accent-light)' }}>MOVIES</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
              Premier cinema ticketing experience offering real-time seat selection, contactless passes, and curated blockbuster premieres.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { icon: <FaTwitter size={15} />, label: 'Twitter' },
                { icon: <FaFacebook size={15} />, label: 'Facebook' },
                { icon: <FaInstagram size={15} />, label: 'Instagram' },
                { icon: <FaYoutube size={15} />, label: 'YouTube' },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href="#"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent)';
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  }}
                  aria-label={item.label}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '18px' }}>
              Explore
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '11px' }}>
              <li>
                <Link to="/" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  Now Showing
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  My Bookings
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '18px' }}>
              Cinemas & Sound
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '11px' }}>
              <li style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>IMAX Laser 4K Projection</li>
              <li style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Dolby Atmos Spatial Audio</li>
              <li style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>PVR Director's Cut Recliners</li>
              <li style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Cinepolis VIP Service</li>
            </ul>
          </div>

          {/* Security & Contact */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '18px' }}>
              Support & Security
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 10px 0' }}>
              support@imovies.com
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                color: 'var(--success)',
                fontSize: '12px',
                fontWeight: 600,
                marginTop: '6px',
              }}
            >
              <FiLock size={12} />
              <span>256-Bit SSL Encrypted</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            color: 'var(--text-tertiary)',
            fontSize: '13px',
          }}
        >
          <div>&copy; {new Date().getFullYear()} IMovies Entertainment Inc. Designed with precision.</div>
          <div style={{ display: 'flex', gap: '18px' }}>
            <span>Privacy</span>
            <span>Terms</span>
            <span>Refund Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
