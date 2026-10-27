import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  FiArrowLeft,
  FiStar,
  FiClock,
  FiGlobe,
  FiCalendar,
  FiMapPin,
  FiPlay,
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle,
  FiCoffee,
  FiSmartphone,
} from 'react-icons/fi';
import API from '../services/api';
import { mockMovies, getMockShows } from '../services/mockData';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

const MovieDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { info } = useToast();

  const [movie, setMovie] = useState(null);
  const [loadingMovie, setLoadingMovie] = useState(true);
  const [shows, setShows] = useState([]);
  const [loadingShows, setLoadingShows] = useState(true);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // Generate 7 upcoming dates
  const upcomingDates = useMemo(() => {
    const list = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNumber = d.getDate();
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      list.push({ dateStr, dayName, dayNumber, monthName, fullDate: d });
    }
    return list;
  }, []);

  const [selectedDate, setSelectedDate] = useState(upcomingDates[0].dateStr);

  // Check query parameter ?trailer=1 to auto-launch trailer
  useEffect(() => {
    if (searchParams.get('trailer') === '1') {
      setShowTrailerModal(true);
    }
  }, [searchParams]);

  // Fetch movie data
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoadingMovie(true);
        const res = await API.get(`/movies/${id}`);
        if (res.data?.success && res.data.data) {
          setMovie(res.data.data);
        } else {
          const fallbackMovie = mockMovies.find((m) => m._id === id) || mockMovies[0];
          setMovie(fallbackMovie);
        }
      } catch (err) {
        console.warn('Error fetching movie, falling back to mock:', err);
        const fallbackMovie = mockMovies.find((m) => m._id === id) || mockMovies[0];
        setMovie(fallbackMovie);
      } finally {
        setLoadingMovie(false);
      }
    };

    fetchMovie();
  }, [id]);

  // Fetch shows when selectedDate or movieId changes
  useEffect(() => {
    const fetchShows = async () => {
      try {
        setLoadingShows(true);
        const res = await API.get(`/shows/movie/${id}?date=${selectedDate}`);
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setShows(res.data.data);
        } else {
          setShows(getMockShows(id, selectedDate));
        }
      } catch (err) {
        console.warn('Error fetching shows, falling back to mock:', err);
        setShows(getMockShows(id, selectedDate));
      } finally {
        setLoadingShows(false);
      }
    };

    fetchShows();
  }, [id, selectedDate]);

  // Group shows by Theatre
  const groupedShows = useMemo(() => {
    const groups = {};
    shows.forEach((show) => {
      if (!groups[show.theatreName]) {
        groups[show.theatreName] = [];
      }
      groups[show.theatreName].push(show);
    });
    return groups;
  }, [shows]);

  // Check if show date is strictly in the past
  const isPastShow = (showDate) => {
    try {
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      return showDate < todayStr;
    } catch {
      return false;
    }
  };

  const handleShowSelect = (show) => {
    if (isPastShow(show.date)) return;

    if (!user) {
      info('Please sign in to select seats and complete your booking.');
      navigate('/login', { state: { from: { pathname: `/booking/${show._id}` } } });
    } else {
      navigate(`/booking/${show._id}`);
    }
  };

  if (loadingMovie) {
    return (
      <div className="container" style={{ padding: '32px 16px' }}>
        <Skeleton width="120px" height="20px" style={{ marginBottom: '24px' }} />
        <Card style={{ padding: '32px', marginBottom: '32px' }}>
          <div className="row g-4 align-items-center">
            <div className="col-md-4 col-lg-3 text-center">
              <Skeleton width="100%" height="340px" borderRadius="12px" />
            </div>
            <div className="col-md-8 col-lg-9">
              <Skeleton width="40%" height="32px" style={{ marginBottom: '16px' }} />
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <Skeleton width="70px" height="24px" />
                <Skeleton width="90px" height="24px" />
                <Skeleton width="80px" height="24px" />
              </div>
              <Skeleton width="100%" height="80px" style={{ marginBottom: '24px' }} />
              <div style={{ display: 'flex', gap: '12px' }}>
                <Skeleton width="140px" height="42px" />
                <Skeleton width="140px" height="42px" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container" style={{ padding: '64px 16px' }}>
        <EmptyState
          title="Movie Not Found"
          description="The movie you requested could not be located in our current catalog."
          actionText="Back to Movies"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  // Description truncation logic
  const isDescLong = movie.description && movie.description.length > 200;
  const displayDescription = isDescLong && !isDescExpanded
    ? `${movie.description.slice(0, 200)}...`
    : movie.description;

  return (
    <div className="container" style={{ padding: '32px 16px' }}>
      {/* Back Link */}
      <div style={{ marginBottom: '20px' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <FiArrowLeft size={16} />
          <span>Back to all movies</span>
        </Link>
      </div>

      {/* ================= MOVIE HERO BANNER ================= */}
      <div
        style={{
          padding: '36px',
          marginBottom: '44px',
          backgroundColor: 'rgba(19, 24, 38, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          boxShadow: '0 24px 60px -15px rgba(0, 0, 0, 0.75)',
        }}
      >
        <div className="row g-4 align-items-center">
          {/* Movie Poster */}
          <div className="col-md-4 col-lg-3 text-center text-md-start">
            <div
              style={{
                position: 'relative',
                display: 'inline-block',
                width: '100%',
                maxWidth: '260px',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 16px 36px rgba(0, 0, 0, 0.6), 0 0 20px rgba(229, 9, 20, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              <img
                src={movie.posterUrl}
                alt={movie.title}
                style={{
                  width: '100%',
                  aspectRatio: '2/3',
                  objectFit: 'cover',
                  display: 'block',
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x450/1A1A23/FFFFFF?text=' + encodeURIComponent(movie.title);
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                }}
              >
                <Badge variant="accent" style={{ fontWeight: 700, borderRadius: '8px' }}>
                  IN THEATRES
                </Badge>
              </div>
            </div>
          </div>

          {/* Movie Details */}
          <div className="col-md-8 col-lg-9">
            {/* Metadata Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 10px',
                  borderRadius: '100px',
                  background: 'rgba(255, 184, 0, 0.15)',
                  border: '1px solid rgba(255, 184, 0, 0.4)',
                  color: '#FCD34D',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                <FiStar size={13} style={{ fill: '#FCD34D' }} />
                <span>{movie.rating ? movie.rating.toFixed(1) : '8.0'} / 10</span>
              </div>
              <Badge variant="neutral" icon={<FiGlobe style={{ marginRight: '4px' }} />}>
                {movie.language}
              </Badge>
              <Badge variant="neutral" icon={<FiClock style={{ marginRight: '4px' }} />}>
                {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
              </Badge>
              <span style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginLeft: '4px' }}>
                Released: {new Date(movie.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>

            <h1
              style={{
                fontSize: '38px',
                fontWeight: 900,
                margin: '0 0 16px 0',
                lineHeight: 1.15,
                letterSpacing: '-0.025em',
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              {movie.title}
            </h1>

            {/* Genre Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '22px' }}>
              {Array.isArray(movie.genre) &&
                movie.genre.map((g) => (
                  <span
                    key={g}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {g}
                  </span>
                ))}
            </div>

            {/* Expandable Description */}
            <div style={{ marginBottom: '28px', maxWidth: '800px' }}>
              <p style={{ color: '#CBD5E1', fontSize: '15.5px', lineHeight: 1.7, margin: 0 }}>
                {displayDescription}
              </p>
              {isDescLong && (
                <button
                  type="button"
                  onClick={() => setIsDescExpanded(!isDescExpanded)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-light)',
                    fontSize: '14px',
                    fontWeight: 700,
                    padding: '8px 0 0 0',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>{isDescExpanded ? 'Read less' : 'Read more'}</span>
                  {isDescExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
              {movie.trailerUrl && (
                <Button
                  variant="outline"
                  size="md"
                  icon={<FiPlay size={16} />}
                  onClick={() => setShowTrailerModal(true)}
                  style={{ borderRadius: '12px', padding: '12px 22px' }}
                >
                  Watch Trailer
                </Button>
              )}
              <a
                href="#showtimes-section"
                style={{ textDecoration: 'none' }}
              >
                <Button
                  variant="primary"
                  size="md"
                  icon={<FiCalendar size={16} />}
                  style={{ borderRadius: '12px', padding: '12px 24px' }}
                >
                  Book Tickets
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 7-DAY DATE SELECTOR ================= */}
      <section id="showtimes-section" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>
              Select Date & Experience
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '4px 0 0 0' }}>
              Choose your preferred date to view scheduled showtimes
            </p>
          </div>
        </div>

        {/* Horizontal Date Picker */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '8px',
          }}
        >
          {upcomingDates.map((item) => {
            const isSelected = selectedDate === item.dateStr;
            return (
              <button
                key={item.dateStr}
                type="button"
                onClick={() => setSelectedDate(item.dateStr)}
                style={{
                  minWidth: '100px',
                  padding: '14px 16px',
                  borderRadius: '14px',
                  border: isSelected ? '1px solid transparent' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isSelected ? 'var(--accent-gradient)' : 'rgba(23, 29, 46, 0.7)',
                  color: '#FFFFFF',
                  boxShadow: isSelected ? 'var(--accent-glow)' : '0 4px 12px rgba(0, 0, 0, 0.25)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  flexShrink: 0,
                  transform: isSelected ? 'scale(1.04)' : 'none',
                }}
              >
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: isSelected ? '#FFFFFF' : 'var(--text-tertiary)',
                    letterSpacing: '0.08em',
                  }}
                >
                  {item.dayName}
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, margin: '3px 0', fontFamily: "'Outfit', sans-serif" }}>
                  {item.dayNumber}
                </div>
                <div
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 600,
                    color: isSelected ? 'rgba(255, 255, 255, 0.9)' : 'var(--text-secondary)',
                    textTransform: 'uppercase',
                  }}
                >
                  {item.monthName}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ================= SHOWTIMES GROUPED BY THEATRE ================= */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>
            Theatres & Schedules
          </h2>
          <Badge variant="neutral">
            {Object.keys(groupedShows).length} Theatres Available
          </Badge>
        </div>

        {loadingShows ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Skeleton width="100%" height="110px" borderRadius="12px" />
            <Skeleton width="100%" height="110px" borderRadius="12px" />
          </div>
        ) : Object.keys(groupedShows).length === 0 ? (
          <Card style={{ padding: '48px', textAlign: 'center' }}>
            <EmptyState
              icon={<FiCalendar size={36} />}
              title="No Shows Scheduled"
              description="There are no showtimes available for this movie on the selected date. Please choose another date above."
            />
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Object.entries(groupedShows).map(([theatreName, theatreShows]) => (
              <Card
                key={theatreName}
                style={{
                  padding: '24px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                }}
              >
                <div className="row g-3 align-items-center">
                  {/* Theatre Info */}
                  <div className="col-lg-4 col-md-5">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <FiMapPin size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                      <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
                        {theatreName}
                      </h3>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          color: 'var(--text-secondary)',
                          backgroundColor: 'var(--bg-surface-alt)',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <FiSmartphone size={11} style={{ color: 'var(--success)' }} /> M-Ticket
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          color: 'var(--text-secondary)',
                          backgroundColor: 'var(--bg-surface-alt)',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <FiCoffee size={11} style={{ color: 'var(--text-secondary)' }} /> F&B Available
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          color: 'var(--text-secondary)',
                          backgroundColor: 'var(--bg-surface-alt)',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <FiCheckCircle size={11} style={{ color: 'var(--success)' }} /> Cancellation Available
                      </span>
                    </div>
                  </div>

                  {/* Showtimes Time Pills */}
                  <div className="col-lg-8 col-md-7">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {theatreShows.map((show) => {
                        const past = isPastShow(show.date);
                        return (
                          <button
                            key={show._id}
                            type="button"
                            disabled={past}
                            onClick={() => handleShowSelect(show)}
                            title={past ? 'This show has passed' : `Click to book for ${show.time}`}
                            style={{
                              minWidth: '130px',
                              padding: '10px 14px',
                              borderRadius: '8px',
                              border: past ? '1px solid var(--border-color)' : '1px solid var(--border-color)',
                              backgroundColor: past ? 'var(--bg-main)' : 'var(--bg-surface-alt)',
                              color: past ? 'var(--text-secondary)' : 'var(--text-primary)',
                              opacity: past ? 0.45 : 1,
                              cursor: past ? 'not-allowed' : 'pointer',
                              textAlign: 'left',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '4px',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              if (!past) {
                                e.currentTarget.style.borderColor = 'var(--accent)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!past) {
                                e.currentTarget.style.borderColor = 'var(--border-color)';
                                e.currentTarget.style.transform = 'translateY(0)';
                              }
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                              <span style={{ fontSize: '15px', fontWeight: 600 }}>{show.time}</span>
                              <span
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  color: 'var(--success)',
                                  backgroundColor: 'rgba(46, 204, 113, 0.12)',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                }}
                              >
                                ${show.price.toFixed(2)}
                              </span>
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                              {show.screen}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ================= OFFICIAL TRAILER MODAL ================= */}
      <Modal
        isOpen={showTrailerModal}
        onClose={() => setShowTrailerModal(false)}
        title={`${movie.title} — Official Trailer`}
        maxWidth="800px"
      >
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px' }}>
          <iframe
            src={`${movie.trailerUrl}?autoplay=1`}
            title={`${movie.title} Trailer`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 0,
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </Modal>
    </div>
  );
};

export default MovieDetails;
