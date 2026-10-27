import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiFilm,
  FiPlus,
  FiTrash2,
} from 'react-icons/fi';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'past', 'cancelled'
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const { success, error: toastError } = useToast();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await API.get('/bookings/my');
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
      toastError('Failed to fetch your bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Check if show is in the past
  const isPastShow = (dateStr) => {
    try {
      if (!dateStr) return false;
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      return dateStr < todayStr;
    } catch {
      return false;
    }
  };

  // Split bookings into Upcoming, Past, and Cancelled
  const { upcomingBookings, pastBookings, cancelledBookings } = useMemo(() => {
    const upcoming = [];
    const past = [];
    const cancelled = [];

    bookings.forEach((b) => {
      if (b.status === 'cancelled') {
        cancelled.push(b);
      } else {
        const show = b.show;
        if (show && isPastShow(show.date)) {
          past.push(b);
        } else {
          upcoming.push(b);
        }
      }
    });

    return {
      upcomingBookings: upcoming,
      pastBookings: past,
      cancelledBookings: cancelled,
    };
  }, [bookings]);

  const displayedBookings = useMemo(() => {
    if (activeTab === 'upcoming') return upcomingBookings;
    if (activeTab === 'past') return pastBookings;
    return cancelledBookings;
  }, [activeTab, upcomingBookings, pastBookings, cancelledBookings]);

  // Handle Cancellation
  const handleConfirmCancel = async () => {
    if (!cancellingBooking) return;

    try {
      setIsCancelling(true);
      const res = await API.put(`/bookings/${cancellingBooking._id}/cancel`);
      if (res.data.success) {
        success('Booking cancelled successfully and seats released.');
        setBookings((prev) =>
          prev.map((b) =>
            b._id === cancellingBooking._id ? { ...b, status: 'cancelled' } : b
          )
        );
        setCancellingBooking(null);
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="container" style={{ padding: '32px 16px' }}>
      {/* Top Header */}
      <PageHeader
        title="My Bookings"
        subtitle="Manage your active tickets, viewing history, and cancellations"
        actions={
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="sm" icon={<FiPlus size={16} />}>
              Book New Tickets
            </Button>
          </Link>
        }
      />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setActiveTab('upcoming')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '20px',
            border: activeTab === 'upcoming' ? '1px solid var(--accent)' : '1px solid var(--border-color)',
            backgroundColor: activeTab === 'upcoming' ? 'var(--accent)' : 'var(--bg-surface)',
            color: activeTab === 'upcoming' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <span>Upcoming Shows</span>
          <span
            style={{
              fontSize: '12px',
              padding: '2px 8px',
              borderRadius: '10px',
              backgroundColor: activeTab === 'upcoming' ? 'rgba(0,0,0,0.25)' : 'var(--bg-surface-alt)',
              color: activeTab === 'upcoming' ? 'var(--text-primary)' : 'var(--text-primary)',
            }}
          >
            {upcomingBookings.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('past')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '20px',
            border: activeTab === 'past' ? '1px solid var(--accent)' : '1px solid var(--border-color)',
            backgroundColor: activeTab === 'past' ? 'var(--accent)' : 'var(--bg-surface)',
            color: activeTab === 'past' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <span>Past Shows</span>
          <span
            style={{
              fontSize: '12px',
              padding: '2px 8px',
              borderRadius: '10px',
              backgroundColor: activeTab === 'past' ? 'rgba(0,0,0,0.25)' : 'var(--bg-surface-alt)',
              color: activeTab === 'past' ? 'var(--text-primary)' : 'var(--text-primary)',
            }}
          >
            {pastBookings.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cancelled')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '20px',
            border: activeTab === 'cancelled' ? '1px solid var(--accent)' : '1px solid var(--border-color)',
            backgroundColor: activeTab === 'cancelled' ? 'var(--accent)' : 'var(--bg-surface)',
            color: activeTab === 'cancelled' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <span>Cancelled</span>
          <span
            style={{
              fontSize: '12px',
              padding: '2px 8px',
              borderRadius: '10px',
              backgroundColor: activeTab === 'cancelled' ? 'rgba(0,0,0,0.25)' : 'var(--bg-surface-alt)',
              color: activeTab === 'cancelled' ? 'var(--text-primary)' : 'var(--text-primary)',
            }}
          >
            {cancelledBookings.length}
          </span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Skeleton width="100%" height="160px" borderRadius="12px" />
          <Skeleton width="100%" height="160px" borderRadius="12px" />
        </div>
      ) : displayedBookings.length === 0 ? (
        <Card style={{ padding: '48px', textAlign: 'center' }}>
          <EmptyState
            icon={<FiFilm size={40} />}
            title={
              activeTab === 'upcoming'
                ? 'No Upcoming Bookings'
                : activeTab === 'past'
                ? 'No Past Bookings'
                : 'No Cancelled Bookings'
            }
            description={
              activeTab === 'upcoming'
                ? "You don't have any upcoming cinema tickets reserved. Browse our currently showing movies and book your seats now."
                : activeTab === 'past'
                ? 'You have not attended any movie screenings yet.'
                : 'You do not have any cancelled reservations in your history.'
            }
            actionText="Browse Movies"
            onAction={() => (window.location.href = '/')}
          />
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {displayedBookings.map((b) => {
            const show = b.show;
            const movie = show?.movie;
            const isConfirmed = b.status === 'confirmed';
            const past = isPastShow(show?.date);

            return (
              <div
                key={b._id}
                className="ui-ticket"
                style={{
                  padding: '24px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                }}
              >
                <div className="row g-3 align-items-center">
                  {/* Poster Thumbnail */}
                  <div className="col-auto">
                    <img
                      src={movie?.posterUrl}
                      alt={movie?.title || 'Movie'}
                      style={{
                        width: '84px',
                        height: '120px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        display: 'block',
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/84x120/1A1A23/FFFFFF?text=Movie';
                      }}
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="col">
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
                      <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 4px 0' }}>
                          {movie?.title || 'Movie'}
                        </h2>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FiMapPin size={13} style={{ color: 'var(--accent)' }} />
                          <span>{show?.theatreName || 'Theatre'}</span>
                          <span>•</span>
                          <span>{show?.screen}</span>
                        </div>
                      </div>

                      <div>
                        {isConfirmed ? (
                          <Badge variant="success" icon={<FiCheckCircle size={12} style={{ marginRight: '4px' }} />}>
                            Confirmed
                          </Badge>
                        ) : (
                          <Badge variant="danger" icon={<FiXCircle size={12} style={{ marginRight: '4px' }} />}>
                            Cancelled
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Meta info boxes */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                        gap: '12px',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-surface-alt)',
                        border: '1px solid var(--border-color)',
                        marginTop: '12px',
                        marginBottom: '16px',
                        fontSize: '13px',
                      }}
                    >
                      <div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase' }}>Show Date</div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>{show?.date || 'N/A'}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase' }}>Showtime</div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>{show?.time || 'N/A'}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase' }}>Seats Reserved</div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                          {b.seats?.join(', ')}
                        </div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase' }}>Total Amount</div>
                        <div style={{ fontWeight: 700, color: isConfirmed ? 'var(--success)' : 'var(--text-secondary)', fontSize: '15px', marginTop: '2px' }}>
                          ${b.totalAmount?.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Dashed divider */}
                    <div className="ui-ticket-dashed">
                      <div className="ui-ticket-notch-left" />
                      <div className="ui-ticket-notch-right" />
                    </div>

                    {/* Footer Actions & Reference */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', paddingTop: '4px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                        Ref: {b._id} • Booked on {new Date(b.bookingDate || b.createdAt).toLocaleDateString()}
                      </div>

                      {/* Cancel Reservation CTA */}
                      {isConfirmed && !past && (
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<FiTrash2 size={14} />}
                          onClick={() => setCancellingBooking(b)}
                          style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                        >
                          Cancel Reservation
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= CANCEL CONFIRMATION MODAL ================= */}
      <Modal
        isOpen={Boolean(cancellingBooking)}
        onClose={() => setCancellingBooking(null)}
        title="Cancel Booking Confirmation"
        maxWidth="520px"
        footer={
          <>
            <Button
              variant="outline"
              size="md"
              onClick={() => setCancellingBooking(null)}
              disabled={isCancelling}
            >
              Keep Booking
            </Button>
            <Button
              variant="danger"
              size="md"
              loading={isCancelling}
              onClick={handleConfirmCancel}
            >
              Confirm Cancellation
            </Button>
          </>
        }
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(231, 76, 60, 0.1)',
              border: '1px solid var(--danger)',
              marginBottom: '16px',
            }}
          >
            <FiAlertTriangle size={24} style={{ color: 'var(--danger)', flexShrink: 0 }} />
            <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
              Are you sure you want to cancel your reservation for{' '}
              <strong>{cancellingBooking?.show?.movie?.title || 'this movie'}</strong>?
            </div>
          </div>

          <div
            style={{
              padding: '16px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-surface-alt)',
              border: '1px solid var(--border-color)',
              marginBottom: '16px',
              fontSize: '14px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <span>Showtime:</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                {cancellingBooking?.show?.date} at {cancellingBooking?.show?.time}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <span>Seats to be released:</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                {cancellingBooking?.seats?.join(', ')}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Refund Amount:</span>
              <span style={{ color: 'var(--success)', fontWeight: 700 }}>
                ${cancellingBooking?.totalAmount?.toFixed(2)}
              </span>
            </div>
          </div>

          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
            Once confirmed, these seats will immediately be released back to the general inventory for other users to book.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default MyBookings;
