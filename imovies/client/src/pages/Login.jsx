import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FiMail, FiLock, FiFilm, FiShield, FiCheckCircle, FiArrowRight, FiZap } from 'react-icons/fi';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const { login } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please enter both email and password');
      return;
    }

    try {
      setSubmitting(true);
      const user = await login(email.trim(), password);
      success(`Welcome back, ${user.name}`);
      navigate(from, { replace: true });
    } catch (err) {
      let msg = 'Login failed. Please check your credentials.';
      if (!err.response) {
        msg = `Cannot reach backend API server at ${API.defaults.baseURL || 'http://localhost:5000/api'}. Please verify connectivity.`;
      } else if (err.response.data?.message) {
        msg = err.response.data.message;
      }
      setFormError(msg);
      toastError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setFormError('');
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: 'calc(100vh - 76px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 20px',
        overflow: 'hidden',
      }}
    >
      {/* Cinematic Ambient Spotlights */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '15%',
          width: '380px',
          height: '380px',
          background: 'radial-gradient(circle, rgba(229, 9, 20, 0.22) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '15%',
          width: '340px',
          height: '340px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1080px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'center',
        }}
      >
        {/* Left Column: Atmospheric Cinema Showcase */}
        <div style={{ padding: '20px 10px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '100px',
              background: 'rgba(229, 9, 20, 0.12)',
              border: '1px solid rgba(229, 9, 20, 0.3)',
              color: 'var(--accent-light)',
              fontSize: '12.5px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '20px',
            }}
          >
            <FiZap size={14} />
            <span>VIP Premiere Access</span>
          </div>

          <h1
            style={{
              fontSize: '38px',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '18px',
              letterSpacing: '-0.03em',
            }}
          >
            Experience Cinema in <span className="gradient-accent-text">Pure Luxury</span>
          </h1>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '16px',
              lineHeight: 1.6,
              marginBottom: '32px',
              maxWidth: '460px',
            }}
          >
            Reserve your favorite seats with live interactive theater layout, instant contactless mobile passes, and exclusive member perks.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '420px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--success)',
                  flexShrink: 0,
                }}
              >
                <FiCheckCircle size={16} />
              </div>
              <span style={{ fontSize: '14.5px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Real-time synchronized theater seat layout
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(229, 9, 20, 0.15)',
                  border: '1px solid rgba(229, 9, 20, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-light)',
                  flexShrink: 0,
                }}
              >
                <FiShield size={16} />
              </div>
              <span style={{ fontSize: '14.5px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Atomic race-condition protected seat reservations
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(255, 184, 0, 0.15)',
                  border: '1px solid rgba(255, 184, 0, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold)',
                  flexShrink: 0,
                }}
              >
                <FiFilm size={16} />
              </div>
              <span style={{ fontSize: '14.5px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Digital contactless passes generated in seconds
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Glassmorphic Auth Card */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              background: 'rgba(19, 24, 38, 0.82)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '24px',
              padding: '36px 32px',
              boxShadow: '0 24px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(229, 9, 20, 0.2)',
            }}
          >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #FF334B 0%, #E50914 100%)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  marginBottom: '16px',
                  boxShadow: '0 8px 24px rgba(229, 9, 20, 0.45)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <FiFilm size={26} />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>
                Welcome Back
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
                Sign in to manage your tickets and reservations
              </p>
            </div>

            {formError && (
              <div
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  color: '#F87171',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  fontSize: '13.5px',
                  marginBottom: '20px',
                  lineHeight: 1.4,
                }}
              >
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<FiMail size={16} />}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<FiLock size={16} />}
                required
              />

              <Button
                type="submit"
                variant="primary"
                loading={submitting}
                style={{
                  width: '100%',
                  marginTop: '10px',
                  marginBottom: '24px',
                  padding: '13px',
                  borderRadius: '12px',
                  fontSize: '15px',
                }}
                icon={<FiArrowRight size={18} />}
              >
                Sign In
              </Button>
            </form>

            {/* Quick Demo Credentials */}
            <div
              style={{
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--text-tertiary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '12px',
                  textAlign: 'center',
                }}
              >
                Instant 1-Click Demo Accounts
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <Button
                  variant="secondary"
                  size="sm"
                  style={{
                    borderRadius: '10px',
                    fontSize: '12.5px',
                    padding: '9px 12px',
                  }}
                  onClick={() => handleQuickFill('user@movies.com', 'user123')}
                >
                  Demo User
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  style={{
                    borderRadius: '10px',
                    fontSize: '12.5px',
                    padding: '9px 12px',
                  }}
                  onClick={() => handleQuickFill('admin@imovies.com', 'admin123')}
                >
                  Studio Admin
                </Button>
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
              New to IMovies?{' '}
              <Link
                to="/register"
                style={{
                  color: 'var(--accent-light)',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
