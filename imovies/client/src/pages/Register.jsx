import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FiUser, FiMail, FiLock, FiFilm, FiShield, FiCheckCircle, FiArrowRight, FiStar } from 'react-icons/fi';
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
    if (!password) return { level: 0, label: '', color: 'rgba(255, 255, 255, 0.1)' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[A-Z]/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { level: 1, label: 'Weak', color: '#EF4444' };
    if (score <= 2) return { level: 2, label: 'Good', color: '#FFB800' };
    return { level: 3, label: 'Strong', color: '#10B981' };
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
      const user = await register(name.trim(), email.trim(), password);
      success(`Welcome to IMovies, ${user.name}`);
      navigate('/');
    } catch (err) {
      let msg = 'Registration failed. Please try again.';
      if (!err.response) {
        msg = 'Cannot connect to backend server. Please verify connection.';
      } else if (err.response.data?.message) {
        msg = err.response.data.message;
      }
      setFormError(msg);
      toastError(msg);
    } finally {
      setSubmitting(false);
    }
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
          top: '15%',
          right: '15%',
          width: '380px',
          height: '380px',
          background: 'radial-gradient(circle, rgba(229, 9, 20, 0.22) 0%, transparent 70%)',
          filter: 'blur(55px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '15%',
          width: '360px',
          height: '360px',
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
              background: 'rgba(255, 184, 0, 0.12)',
              border: '1px solid rgba(255, 184, 0, 0.3)',
              color: 'var(--gold)',
              fontSize: '12.5px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '20px',
            }}
          >
            <FiStar size={14} />
            <span>Join VIP Club Today</span>
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
            Unlock the Ultimate <span className="gradient-accent-text">Cinema Pass</span>
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
            Create your account in under a minute. Enjoy instant seat selections, paperless QR passes, and zero booking friction.
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
                Instant booking confirmation & seat lock
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
                Encrypted bank-grade security for your data
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
                Access to 275+ daily showtimes nationwide
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Glassmorphic Registration Card */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
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
            <div style={{ textAlign: 'center', marginBottom: '26px' }}>
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
                Create Account
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
                Join IMovies to book seats in premier cinemas
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
                label="Full Name"
                placeholder="Ritesh Khedekar"
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
                label="Password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<FiLock size={16} />}
                required
              />

              {/* Cute Password Strength Meter */}
              {password && (
                <div style={{ marginBottom: '16px', marginTop: '-6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Password Strength
                    </span>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '5px', height: '4px' }}>
                    {[1, 2, 3].map((lvl) => (
                      <div
                        key={lvl}
                        style={{
                          flex: 1,
                          borderRadius: '10px',
                          backgroundColor:
                            passwordStrength.level >= lvl ? passwordStrength.color : 'rgba(255, 255, 255, 0.08)',
                          transition: 'all 0.3s ease',
                          boxShadow: passwordStrength.level >= lvl ? `0 0 8px ${passwordStrength.color}` : 'none',
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                  marginBottom: '20px',
                  padding: '13px',
                  borderRadius: '12px',
                  fontSize: '15px',
                }}
                icon={<FiArrowRight size={18} />}
              >
                Create Account
              </Button>
            </form>

            <div style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
              Already registered?{' '}
              <Link
                to="/login"
                style={{
                  color: 'var(--accent-light)',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
