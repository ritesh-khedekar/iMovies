import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FiFilm, FiArrowLeft } from 'react-icons/fi';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Card from './components/ui/Card';
import Button from './components/ui/Button';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MovieDetails from './pages/MovieDetails';
import SeatSelection from './pages/SeatSelection';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: 'var(--bg-main)' }}>
            <Navbar />
            <main className="flex-grow-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/movies/:id" element={<MovieDetails />} />

                {/* User Protected Routes */}
                <Route
                  path="/booking/:showId"
                  element={
                    <ProtectedRoute>
                      <SeatSelection />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-bookings"
                  element={
                    <ProtectedRoute>
                      <MyBookings />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Only Route */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />

                {/* 404 Route */}
                <Route
                  path="*"
                  element={
                    <div className="container" style={{ padding: '80px 16px', display: 'flex', justifyContent: 'center' }}>
                      <Card
                        style={{
                          maxWidth: '480px',
                          textAlign: 'center',
                          padding: '48px 32px',
                          backgroundColor: 'var(--bg-surface)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '12px',
                        }}
                      >
                        <div
                          style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--bg-surface-alt)',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px auto',
                            color: 'var(--accent)',
                          }}
                        >
                          <FiFilm size={32} />
                        </div>
                        <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--accent)', margin: '0 0 8px 0' }}>
                          404
                        </h1>
                        <h2 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 12px 0' }}>
                          Page Not Found
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, margin: '0 0 24px 0' }}>
                          The screen or cinema feature you were looking for doesn't exist or has been relocated.
                        </p>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                          <Button variant="primary" size="md" icon={<FiArrowLeft size={16} />}>
                            Return to Home
                          </Button>
                        </Link>
                      </Card>
                    </div>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
