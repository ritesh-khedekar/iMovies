import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiCheckCircle,
  FiX,
  FiShield,
  FiActivity,
  FiFilm,
} from 'react-icons/fi';
import API from '../services/api';
import { getMockShowById } from '../services/mockData';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { success, error: toastError, warning } = useToast();

  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Rows A to J, Seats 1 to 10
  const rows = useMemo(() => ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'], []);
  const seatNumbers = useMemo(() => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], []);

  // Fetch show details
  const fetchShowDetails = useCallback(
    async (isPolling = false) => {
      try {
        if (!isPolling) setLoading(true);
        const res = await API.get(`/shows/${showId}`);
        if (res.data?.success && res.data.data) {
          const fetchedShow = res.data.data;
          setShow(fetchedShow);

          // If any of our selected seats became booked while polling
          if (isPolling && selectedSeats.length > 0) {
            const newlyBooked = selectedSeats.filter((s) =>
              fetchedShow.bookedSeats?.includes(s)
            );
            if (newlyBooked.length > 0) {
              warning(`Seat(s) ${newlyBooked.join(', ')} were just reserved by another guest.`);
              setSelectedSeats((prev) => prev.filter((s) => !newlyBooked.includes(s)));
            }
          }
        } else {
          setShow(getMockShowById(showId));
        }
      } catch (err) {
        if (!isPolling) {
          console.warn('Failed to load show from backend, using fallback:', err);
          setShow(getMockShowById(showId));
        }
      } finally {
        if (!isPolling) setLoading(false);
      }
    },
    [showId, selectedSeats, toastError, warning]
  );

  // Initial fetch
  useEffect(() => {
    fetchShowDetails(false);
  }, [showId]);

  // Polling every 10 seconds for real-time seat availability
  useEffect(() => {
    const interval = setInterval(() => {
      fetchShowDetails(true);
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchShowDetails]);

  // Toggle seat selection
  const handleSeatClick = (seatCode) => {
    if (show?.bookedSeats?.includes(seatCode)) return;

    setSelectedSeats((prev) => {
      if (prev.includes(seatCode)) {
        return prev.filter((s) => s !== seatCode);
      } else {
        if (prev.length >= 8) {
          warning('Maximum 8 tickets allowed per booking');
          return prev;
        }
        return [...prev, seatCode].sort();
      }
    });
  };

  // Submit booking
  const handleConfirmBooking = async () => {
    if (selectedSeats.length === 0) {
      toastError('Please select at least one seat to proceed.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await API.post('/bookings', {
        showId: show._id,
        seats: selectedSeats,
      });

      if (res.data.success) {
        const bookingData = res.data.data || res.data.booking;
        setConfirmedBooking(bookingData);
        success('Tickets booked successfully! Enjoy your movie.');
        // Refresh show data to reflect new booked seats
        fetchShowDetails(true);
      }
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;

      if (status === 409) {
        // Double-booking conflict
        toastError(data?.message || 'Seat conflict: selected seats were just taken.');
        // Refresh seats immediately
        fetchShowDetails(false);
        // Deselect conflicted seats
        if (data?.conflictSeats) {
          setSelectedSeats((prev) =>
            prev.filter((s) => !data.conflictSeats.includes(s))
          );
        }
      } else {
        toastError(data?.message || 'Booking failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '32px 16px' }}>
        <Skeleton width="160px" height="20px" style={{ marginBottom: '24px' }} />
        <div className="row g-4">
          <div className="col-lg-8">
            <Card style={{ padding: '32px' }}>
              <Skeleton width="80%" height="32px" style={{ margin: '0 auto 24px auto' }} />
              <Skeleton width="100%" height="380px" borderRadius="12px" />
            </Card>
          </div>
          <div className="col-lg-4">
            <Card style={{ padding: '24px' }}>
              <Skeleton width="100%" height="180px" borderRadius="8px" style={{ marginBottom: '16px' }} />
              <Skeleton width="100%" height="100px" borderRadius="8px" />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="container" style={{ padding: '64px 16px' }}>
        <EmptyState
          title="Showtime Not Found"
          description="The selected show could not be located in our records."
          actionText="Back to Movies"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  const movie = show.movie;
  const totalPrice = selectedSeats.length * show.price;

  return (
    <div className="container" style={{ padding: '32px 16px' }}>
      {/* ================= BREADCRUMB & HEADER ================= */}
      <Card
        style={{
          padding: '20px 24px',
          marginBottom: '24px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div>
            <Link
              to={`/movies/${movie?._id || ''}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                marginBottom: '6px',
              }}
            >
              <FiArrowLeft size={14} />
              <span>Change Showtime / Date</span>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>
                {movie?.title}
              </h1>
              <span style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>•</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '16px', fontWeight: 500 }}>
                {show.theatreName}
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <Badge variant="neutral" icon={<FiCalendar size={13} style={{ marginRight: '4px' }} />}>
                {show.date}
              </Badge>
              <Badge variant="neutral" icon={<FiClock size={13} style={{ marginRight: '4px' }} />}>
                {show.time}
              </Badge>
              <Badge variant="accent">
                {show.screen}
              </Badge>
            </div>
          </div>

          <div>
            <Badge variant="success" icon={<FiActivity size={13} style={{ marginRight: '4px' }} />}>
              Live Concurrency Sync Active
            </Badge>
          </div>
        </div>
      </Card>

      <div className="row g-4">
        {/* ================= LEFT: SEAT MATRIX ================= */}
        <div className="col-lg-8">
          <Card
            style={{
              padding: '32px 24px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            {/* Theatrical Curved Screen */}
            <div className="ui-screen-curve">
              THEATRICAL SCREEN THIS WAY
            </div>

            {/* Visual Color Legends */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '24px',
                marginBottom: '28px',
                paddingBottom: '20px',
                borderBottom: '1px solid var(--border-color)',
                fontSize: '13px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  className="ui-seat ui-seat-available"
                  style={{ width: '22px', height: '22px', cursor: 'default' }}
                />
                <span style={{ color: 'var(--text-secondary)' }}>Available</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  className="ui-seat ui-seat-selected"
                  style={{ width: '22px', height: '22px', cursor: 'default' }}
                />
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Selected</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  className="ui-seat ui-seat-booked"
                  style={{ width: '22px', height: '22px', cursor: 'default' }}
                />
                <span style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>Booked / Sold</span>
              </div>
            </div>

            {/* Matrix Layout */}
            <div style={{ display: 'inline-block', maxWidth: '100%', overflowX: 'auto', padding: '0 8px' }}>
              {/* Seating Tier: VIP Rows A-B */}
              <div
                style={{
                  textAlign: 'left',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                  paddingLeft: '36px',
                }}
              >
                VIP Recliner Tier (Rows A - B) • ${show.price.toFixed(2)}
              </div>

              {rows.slice(0, 2).map((row) => (
                <div
                  key={row}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    marginBottom: '8px',
                  }}
                >
                  <div style={{ width: '24px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {row}
                  </div>
                  {seatNumbers.map((num) => {
                    const seatCode = `${row}${num}`;
                    const isBooked = show.bookedSeats?.includes(seatCode);
                    const isSelected = selectedSeats.includes(seatCode);

                    let seatClass = 'ui-seat-available';
                    if (isBooked) seatClass = 'ui-seat-booked';
                    else if (isSelected) seatClass = 'ui-seat-selected';

                    return (
                      <React.Fragment key={seatCode}>
                        {num === 6 && <div style={{ width: '20px' }} />}
                        <button
                          type="button"
                          disabled={isBooked}
                          onClick={() => handleSeatClick(seatCode)}
                          className={`ui-seat ${seatClass}`}
                          title={`Seat ${seatCode} - $${show.price}`}
                          aria-label={`Seat ${seatCode}`}
                        >
                          {num}
                        </button>
                      </React.Fragment>
                    );
                  })}
                  <div style={{ width: '24px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {row}
                  </div>
                </div>
              ))}

              {/* Seating Tier: Executive Rows C-G */}
              <div
                style={{
                  textAlign: 'left',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginTop: '20px',
                  marginBottom: '10px',
                  paddingLeft: '36px',
                }}
              >
                Executive Tier (Rows C - G) • ${show.price.toFixed(2)}
              </div>

              {rows.slice(2, 7).map((row) => (
                <div
                  key={row}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    marginBottom: '8px',
                  }}
                >
                  <div style={{ width: '24px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {row}
                  </div>
                  {seatNumbers.map((num) => {
                    const seatCode = `${row}${num}`;
                    const isBooked = show.bookedSeats?.includes(seatCode);
                    const isSelected = selectedSeats.includes(seatCode);

                    let seatClass = 'ui-seat-available';
                    if (isBooked) seatClass = 'ui-seat-booked';
                    else if (isSelected) seatClass = 'ui-seat-selected';

                    return (
                      <React.Fragment key={seatCode}>
                        {num === 6 && <div style={{ width: '20px' }} />}
                        <button
                          type="button"
                          disabled={isBooked}
                          onClick={() => handleSeatClick(seatCode)}
                          className={`ui-seat ${seatClass}`}
                          title={`Seat ${seatCode} - $${show.price}`}
                          aria-label={`Seat ${seatCode}`}
                        >
                          {num}
                        </button>
                      </React.Fragment>
                    );
                  })}
                  <div style={{ width: '24px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {row}
                  </div>
                </div>
              ))}

              {/* Seating Tier: Classic Rows H-J */}
              <div
                style={{
                  textAlign: 'left',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginTop: '20px',
                  marginBottom: '10px',
                  paddingLeft: '36px',
                }}
              >
                Classic Tier (Rows H - J) • ${show.price.toFixed(2)}
              </div>

              {rows.slice(7, 10).map((row) => (
                <div
                  key={row}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    marginBottom: '8px',
                  }}
                >
                  <div style={{ width: '24px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {row}
                  </div>
                  {seatNumbers.map((num) => {
                    const seatCode = `${row}${num}`;
                    const isBooked = show.bookedSeats?.includes(seatCode);
                    const isSelected = selectedSeats.includes(seatCode);

                    let seatClass = 'ui-seat-available';
                    if (isBooked) seatClass = 'ui-seat-booked';
                    else if (isSelected) seatClass = 'ui-seat-selected';

                    return (
                      <React.Fragment key={seatCode}>
                        {num === 6 && <div style={{ width: '20px' }} />}
                        <button
                          type="button"
                          disabled={isBooked}
                          onClick={() => handleSeatClick(seatCode)}
                          className={`ui-seat ${seatClass}`}
                          title={`Seat ${seatCode} - $${show.price}`}
                          aria-label={`Seat ${seatCode}`}
                        >
                          {num}
                        </button>
                      </React.Fragment>
                    );
                  })}
                  <div style={{ width: '24px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {row}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Note */}
            <div
              style={{
                marginTop: '28px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-color)',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <FiShield size={15} style={{ color: 'var(--accent)' }} />
              <span>Select up to 8 seats per booking transaction. Click any selected seat to deselect.</span>
            </div>
          </Card>
        </div>

        {/* ================= RIGHT: STICKY BOOKING SUMMARY ================= */}
        <div className="col-lg-4">
          <Card
            style={{
              padding: '24px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              position: 'sticky',
              top: '88px',
            }}
          >
            <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 16px 0', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
              Booking Summary
            </h2>

            {/* Movie preview snippet */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-surface-alt)',
                border: '1px solid var(--border-color)',
                marginBottom: '16px',
              }}
            >
              <img
                src={movie?.posterUrl}
                alt={movie?.title}
                style={{ width: '60px', height: '88px', objectFit: 'cover', borderRadius: '6px' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/60x88/1A1A23/FFFFFF?text=Movie';
                }}
              />
              <div style={{ overflow: 'hidden' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 4px 0', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {movie?.title}
                </h3>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  {movie?.language} • {Math.floor(movie?.duration / 60)}h {movie?.duration % 60}m
                </div>
                <div style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FiMapPin size={12} /> {show.theatreName}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {show.screen}
                </div>
              </div>
            </div>

            {/* Show Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Date:</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{show.date}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Showtime:</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{show.time}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Seat Price:</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>${show.price.toFixed(2)} each</span>
              </div>
            </div>

            {/* Selected Seats */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Selected Seats ({selectedSeats.length} / 8):
                </span>
                {selectedSeats.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedSeats([])}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent)',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    Clear All
                  </button>
                )}
              </div>

              {selectedSeats.length === 0 ? (
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-surface-alt)',
                    border: '1px dashed var(--border-color)',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    textAlign: 'center',
                  }}
                >
                  Click any available seat in the matrix to begin.
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-surface-alt)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  {selectedSeats.map((seat) => (
                    <span
                      key={seat}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: 'var(--bg-main)',
                        border: '1px solid var(--success)',
                        color: 'var(--success)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 600,
                      }}
                    >
                      <span>{seat}</span>
                      <FiX
                        size={13}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSeatClick(seat)}
                        title="Remove seat"
                      />
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <span>Tickets ({selectedSeats.length} × ${show.price.toFixed(2)}):</span>
                <span style={{ color: 'var(--text-primary)' }}>${totalPrice.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                <span>Booking Fee:</span>
                <span style={{ color: 'var(--success)', fontWeight: 600 }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Total Amount:</span>
                <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Confirm Booking CTA */}
            <Button
              variant="primary"
              size="lg"
              disabled={selectedSeats.length === 0 || submitting}
              loading={submitting}
              onClick={handleConfirmBooking}
              className="w-100"
              icon={!submitting ? <FiCheckCircle size={18} /> : null}
            >
              {selectedSeats.length > 0
                ? `Confirm Booking (${selectedSeats.length} ${selectedSeats.length === 1 ? 'Seat' : 'Seats'})`
                : 'Select Seats to Proceed'}
            </Button>

            <div
              style={{
                marginTop: '12px',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <FiShield size={13} style={{ color: 'var(--success)' }} />
              <span>Atomic race-condition safety guaranteed</span>
            </div>
          </Card>
        </div>
      </div>

      {/* ================= TICKET CONFIRMATION MODAL ================= */}
      <Modal
        isOpen={Boolean(confirmedBooking)}
        onClose={() => setConfirmedBooking(null)}
        title="Booking Confirmed!"
        maxWidth="500px"
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(46, 204, 113, 0.15)',
              border: '1px solid var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: 'var(--success)',
            }}
          >
            <FiCheckCircle size={32} />
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 6px 0' }}>
            Your Tickets Are Ready!
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 24px 0' }}>
            A digital pass has been generated and saved to your account.
          </p>

          {/* Ticket Card */}
          <div className="ui-ticket" style={{ padding: '24px', textAlign: 'left', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Badge variant="accent">IMOVIES PASS</Badge>
              <Badge variant="success">CONFIRMED</Badge>
            </div>

            <h4 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0' }}>
              {movie?.title}
            </h4>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              {show.theatreName} • {show.screen}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', fontSize: '13px' }}>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Date & Time</div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{show.date} | {show.time}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Seats Allocated</div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{confirmedBooking?.seats?.join(', ')}</div>
              </div>
            </div>

            <div className="ui-ticket-dashed">
              <div className="ui-ticket-notch-left" />
              <div className="ui-ticket-notch-right" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px' }}>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase' }}>Booking ID</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                  {confirmedBooking?._id}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase' }}>Total Paid</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--success)' }}>
                  ${confirmedBooking?.totalAmount?.toFixed(2)}
                </div>
              </div>
            </div>

            {/* QR-style placeholder box */}
            <div
              style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: 'var(--bg-surface-alt)',
                border: '1px dashed var(--border-color)',
                borderRadius: '8px',
                textAlign: 'center',
                fontSize: '12px',
                color: 'var(--text-secondary)',
              }}
            >
              Scan this pass at theatre entry terminal for digital admittance
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/my-bookings" style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="md" className="w-100">
                View in My Bookings
              </Button>
            </Link>
            <Button
              variant="outline"
              size="md"
              className="w-100"
              onClick={() => {
                setConfirmedBooking(null);
                setSelectedSeats([]);
              }}
            >
              Book More Seats
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SeatSelection;
