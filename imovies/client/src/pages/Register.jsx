import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FiUser, FiMail, FiLock, FiFilm, FiCheck } from 'react-icons/fi';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const { register } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  // Password Strength Calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { level: 0, label: '', color: 'var(--border-color)' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[A-Z]/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { level: 1, label: 'Weak', color: 'var(--danger)' };
    if (score <= 2) return { level: 2, label: 'Fair', color: 'var(--accent)' };
    return { level: 3, label: 'Strong', color: 'var(--success)' };
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim() || !email.trim() || !password) {
      setFormError('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    try {
      setSubmitting(true);
      const user = await register(name, email, password);
      success(`Welcome to IMovies, ${user.name}`);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setFormError(msg);
      toastError(msg);
    } finally {
      setSubmitting(false);
    }
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
            Create Your Cinema Account
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.6, maxWidth: '440px' }}>
            Join thousands of cinema lovers. Reserve premiere seats in real-time and access instant digital passes on any device.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '14px' }}>
            <span style={{ color: 'var(--success)', display: 'flex' }}><FiCheck size={18} /></span>
            <span>Personalized booking history & cancellation</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '14px' }}>
            <span style={{ color: 'var(--success)', display: 'flex' }}><FiCheck size={18} /></span>
            <span>Zero convenience fee booking options</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '14px' }}>
            <span style={{ color: 'var(--success)', display: 'flex' }}><FiCheck size={18} /></span>
            <span>Instant confirmation and QR e-ticket</span>
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
            maxWidth: '460px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '32px',
          }}
        >
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '6px' }}>Register</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Create an account to begin booking tickets
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
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<FiUser size={16} />}
              required
            />

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
              label="Password (min 6 characters)"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<FiLock size={16} />}
              required
            />

            {/* Password Strength Indicator */}
            {password && (
              <div style={{ marginBottom: '16px', marginTop: '-8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Password Strength:</span>
                  <span style={{ color: passwordStrength.color, fontWeight: 600 }}>{passwordStrength.label}</span>
                </div>
                <div style={{ display: 'flex', gap: '4px', height: '4px' }}>
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      style={{
                        flex: 1,
                        borderRadius: '2px',
                        backgroundColor: passwordStrength.level >= step ? passwordStrength.color : 'var(--bg-surface-alt)',
                        transition: 'background-color 0.2s ease',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<FiLock size={16} />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              style={{ width: '100%', marginTop: '8px', marginBottom: '24px' }}
            >
              Create Account
            </Button>
          </form>

          <div style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
