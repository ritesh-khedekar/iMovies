import React from 'react';
import { Link } from 'react-router-dom';
import { FiFilm, FiShield, FiClock, FiCheckCircle } from 'react-icons/fi';
import { FaTwitter, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-color)',
        marginTop: 'auto',
        padding: '48px 0 24px 0',
      }}
    >
      <div className="container">
        {/* Value Proposition Highlights */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
            paddingBottom: '40px',
            marginBottom: '40px',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-surface-alt)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)',
              }}
            >
              <FiShield size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '15px' }}>Guaranteed Booking</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Atomic concurrency safe</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-surface-alt)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--success)',
              }}
            >
              <FiCheckCircle size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '15px' }}>Instant Cancellation</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Immediate seat release</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-surface-alt)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
              }}
            >
              <FiClock size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '15px' }}>Live Seat Sync</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Real-time availability</div>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '32px',
            marginBottom: '40px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-primary)',
                }}
              >
                <FiFilm size={16} />
              </div>
              <span style={{ fontSize: '18px', fontWeight: 800 }}>IMOVIES</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '16px' }}>
              Online movie ticket reservation platform offering instant bookings, real-time seat availability, and contactless entry.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="#" style={{ color: 'var(--text-secondary)', padding: '6px' }} aria-label="Twitter">
                <FaTwitter size={16} />
              </a>
              <a href="#" style={{ color: 'var(--text-secondary)', padding: '6px' }} aria-label="Facebook">
                <FaFacebook size={16} />
              </a>
              <a href="#" style={{ color: 'var(--text-secondary)', padding: '6px' }} aria-label="Instagram">
                <FaInstagram size={16} />
              </a>
              <a href="#" style={{ color: 'var(--text-secondary)', padding: '6px' }} aria-label="YouTube">
                <FaYoutube size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link to="/" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Now Showing</Link></li>
              <li><Link to="/my-bookings" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>My Bookings</Link></li>
              <li><Link to="/login" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Sign In</Link></li>
              <li><Link to="/register" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Register</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Cinemas & Technology</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>IMAX Laser 3D</li>
              <li style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Dolby Atmos Surround</li>
              <li style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>VIP Recliner Suites</li>
              <li style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>4DX Motion Seating</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Contact & Support</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 8px 0' }}>
              Email: support@imovies.com
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 8px 0' }}>
              Helpline: +1 (800) 555-FILM
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
              Available 24/7 for booking inquiries
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            color: 'var(--text-secondary)',
            fontSize: '13px',
          }}
        >
          <div>&copy; {new Date().getFullYear()} IMovies Entertainment Inc. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
