import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FiMail, FiLock, FiFilm, FiShield, FiClock, FiCheck } from 'react-icons/fi';
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
      const user = await login(email, password);
      success(`Welcome back, ${user.name}`);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
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
        display: 'flex',
        minHeight: 'calc(100vh - 72px - 250px)',
        backgroundColor: 'var(--bg-main)',
      }}
    >
      {/* Left Half: Cinematic Showcase Banner (Hidden on Mobile) */}
      <div
        className="d-none d-lg-flex"
        style={{
          flex: '1 1 50%',
          backgroundColor: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-color)',
          padding: '64px',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
              }}
            >
              <FiFilm size={22} />
            </div>
            <span style={{ fontSize: '24px', fontWeight: 800 }}>
              I<span style={{ color: 'var(--accent)' }}>MOVIES</span>
            </span>
          </div>

          <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '16px', lineHeight: 1.25 }}>
            The Premier Destination for Cinema Enthusiasts
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.6, maxWidth: '440px' }}>
            Experience lightning-fast ticket reservations with real-time seat availability and instant confirmation across premier theatres.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '14px' }}>
            <span style={{ color: 'var(--success)', display: 'flex' }}><FiCheck size={18} /></span>
            <span>Real-time interactive seat selection matrix</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '14px' }}>
            <span style={{ color: 'var(--success)', display: 'flex' }}><FiCheck size={18} /></span>
            <span>Atomic race-condition protected reservations</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '14px' }}>
            <span style={{ color: 'var(--success)', display: 'flex' }}><FiCheck size={18} /></span>
            <span>Digital contactless pass generated instantly</span>
          </div>
        </div>

        <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
          &copy; {new Date().getFullYear()} IMovies Entertainment Platform
        </div>
      </div>

      {/* Right Half: Centered Form Card */}
      <div
        style={{
          flex: '1 1 50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '440px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '32px',
          }}
        >
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '6px' }}>Sign In</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Enter your credentials to access your bookings
            </p>
          </div>

          {formError && (
            <div
              style={{
                backgroundColor: 'var(--bg-surface-alt)',
                border: '1px solid var(--danger)',
                color: 'var(--danger)',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '14px',
                marginBottom: '16px',
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
              style={{ width: '100%', marginTop: '8px', marginBottom: '24px' }}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Credentials */}
          <div
            style={{
              paddingTop: '20px',
              borderTop: '1px solid var(--border-color)',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '10px',
                textAlign: 'center',
              }}
            >
              Quick Demo Accounts
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleQuickFill('user@imovies.com', 'user123')}
              >
                Demo User
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickFill('admin@imovies.com', 'admin123')}
              >
                Demo Admin
              </Button>
            </div>
          </div>

          <div style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Do not have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
