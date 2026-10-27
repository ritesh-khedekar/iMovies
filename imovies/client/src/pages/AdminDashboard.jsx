import React, { useState, useEffect, useMemo } from 'react';
import {
  FiFilm,
  FiCalendar,
  FiBookOpen,
  FiDollarSign,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiLayers,
  FiChevronLeft,
  FiChevronRight,
  FiShield,
  FiEye,
} from 'react-icons/fi';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('movies'); // 'movies', 'shows', 'bookings'
  const { success, error: toastError } = useToast();

  // Data states
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter states
  const [movieSearch, setMovieSearch] = useState('');
  const [showSearch, setShowSearch] = useState('');
  const [showMovieFilter, setShowMovieFilter] = useState('All');
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('All');

  // Pagination states
  const [page, setPage] = useState(1);
  const perPage = 8;

  // Reset page when tab or filters change
  useEffect(() => {
    setPage(1);
  }, [activeTab, movieSearch, showSearch, showMovieFilter, bookingSearch, bookingStatusFilter]);

  // Movie Modal States
  const [movieModalOpen, setMovieModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [movieFormData, setMovieFormData] = useState({
    title: '',
    description: '',
    genre: '',
    language: 'English',
    duration: 120,
    releaseDate: '',
    rating: 8.0,
    posterUrl: '',
    trailerUrl: '',
    isActive: true,
  });
  const [movieErrors, setMovieErrors] = useState({});

  // Show Modal States
  const [showModalOpen, setShowModalOpen] = useState(false);
  const [editingShow, setEditingShow] = useState(null);
  const [showFormData, setShowFormData] = useState({
    movie: '',
    theatreName: '',
    screen: '',
    date: '',
    time: '',
    price: 15,
    totalSeats: 100,
  });
  const [showErrors, setShowErrors] = useState({});

  // Delete Confirmation Modal States
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: '', // 'movie' or 'show'
    id: null,
    title: '',
  });

  // Fetch all initial data
  const loadAllData = async () => {
    try {
      setLoading(true);
      const [moviesRes, showsRes, bookingsRes] = await Promise.all([
        API.get('/movies?isActive=all'),
        API.get('/shows'),
        API.get('/bookings'),
      ]);

      if (moviesRes.data.success) setMovies(moviesRes.data.data);
      if (showsRes.data.success) setShows(showsRes.data.data);
      if (bookingsRes.data.success) setBookings(bookingsRes.data.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      toastError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Stats calculation
  const stats = useMemo(() => {
    const totalRevenue = bookings
      .filter((b) => b.status === 'confirmed')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    return {
      totalMovies: movies.length,
      totalShows: shows.length,
      totalBookings: bookings.length,
      revenue: totalRevenue,
    };
  }, [movies, shows, bookings]);

  // ---------------- MOVIE HANDLERS ----------------
  const openAddMovieModal = () => {
    setEditingMovie(null);
    setMovieErrors({});
    setMovieFormData({
      title: '',
      description: '',
      genre: '',
      language: 'English',
      duration: 120,
      releaseDate: new Date().toISOString().split('T')[0],
      rating: 8.0,
      posterUrl: '',
      trailerUrl: '',
      isActive: true,
    });
    setMovieModalOpen(true);
  };

  const openEditMovieModal = (movie) => {
    setEditingMovie(movie);
    setMovieErrors({});
    setMovieFormData({
      title: movie.title,
      description: movie.description,
      genre: Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre,
      language: movie.language,
      duration: movie.duration,
      releaseDate: movie.releaseDate ? movie.releaseDate.split('T')[0] : '',
      rating: movie.rating,
      posterUrl: movie.posterUrl,
      trailerUrl: movie.trailerUrl || '',
      isActive: movie.isActive,
    });
    setMovieModalOpen(true);
  };

  const handleMovieSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!movieFormData.title.trim()) errs.title = 'Title is required';
    if (!movieFormData.posterUrl.trim()) errs.posterUrl = 'Poster image URL is required';
    if (!movieFormData.description.trim()) errs.description = 'Description is required';
    if (!movieFormData.genre.trim()) errs.genre = 'At least one genre is required';
    if (Object.keys(errs).length > 0) {
      setMovieErrors(errs);
      return;
    }

    try {
      const payload = {
        ...movieFormData,
        duration: Number(movieFormData.duration),
        rating: Number(movieFormData.rating),
        genre: movieFormData.genre.split(',').map((g) => g.trim()).filter(Boolean),
      };

      if (editingMovie) {
        const res = await API.put(`/movies/${editingMovie._id}`, payload);
        if (res.data.success) {
          success('Movie updated successfully');
          setMovies((prev) =>
            prev.map((m) => (m._id === editingMovie._id ? res.data.data : m))
          );
        }
      } else {
        const res = await API.post('/movies', payload);
        if (res.data.success) {
          success('Movie added successfully');
          setMovies((prev) => [res.data.data, ...prev]);
        }
      }
      setMovieModalOpen(false);
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to save movie');
    }
  };

  // ---------------- SHOW HANDLERS ----------------
  const openAddShowModal = () => {
    setEditingShow(null);
    setShowErrors({});
    setShowFormData({
      movie: movies[0]?._id || '',
      theatreName: 'PVR IMAX Grand Plaza',
      screen: 'IMAX Laser 1',
      date: new Date().toISOString().split('T')[0],
      time: '06:15 PM',
      price: 18,
      totalSeats: 100,
    });
    setShowModalOpen(true);
  };

  const openEditShowModal = (show) => {
    setEditingShow(show);
    setShowErrors({});
    setShowFormData({
      movie: show.movie?._id || show.movie,
      theatreName: show.theatreName,
      screen: show.screen,
      date: show.date,
      time: show.time,
      price: show.price,
      totalSeats: show.totalSeats || 100,
    });
    setShowModalOpen(true);
  };

  const handleShowSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!showFormData.movie) errs.movie = 'Movie selection is required';
    if (!showFormData.theatreName.trim()) errs.theatreName = 'Theatre name is required';
    if (!showFormData.screen.trim()) errs.screen = 'Screen name is required';
    if (!showFormData.date) errs.date = 'Date is required';
    if (!showFormData.time) errs.time = 'Time is required';
    if (Object.keys(errs).length > 0) {
      setShowErrors(errs);
      return;
    }

    try {
      const payload = {
        ...showFormData,
        price: Number(showFormData.price),
        totalSeats: Number(showFormData.totalSeats),
      };

      if (editingShow) {
        const res = await API.put(`/shows/${editingShow._id}`, payload);
        if (res.data.success) {
          success('Show updated successfully');
          setShows((prev) =>
            prev.map((s) => (s._id === editingShow._id ? res.data.data : s))
          );
        }
      } else {
        const res = await API.post('/shows', payload);
        if (res.data.success) {
          success('Show added successfully');
          setShows((prev) => [res.data.data, ...prev]);
        }
      }
      setShowModalOpen(false);
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to save show');
    }
  };

  // ---------------- DELETE HANDLER ----------------
  const handleDeleteConfirm = async () => {
    const { type, id } = deleteModal;
    try {
      if (type === 'movie') {
        const res = await API.delete(`/movies/${id}`);
        if (res.data.success) {
          success('Movie deleted successfully');
          setMovies((prev) => prev.filter((m) => m._id !== id));
        }
      } else if (type === 'show') {
        const res = await API.delete(`/shows/${id}`);
        if (res.data.success) {
          success('Show deleted successfully');
          setShows((prev) => prev.filter((s) => s._id !== id));
        }
      }
      setDeleteModal({ isOpen: false, type: '', id: null, title: '' });
    } catch (err) {
      toastError(err.response?.data?.message || `Failed to delete ${type}`);
    }
  };

  // ---------------- FILTERING & PAGINATION ----------------
  const filteredMovies = useMemo(() => {
    if (!movieSearch.trim()) return movies;
    const q = movieSearch.toLowerCase();
    return movies.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        (Array.isArray(m.genre) && m.genre.some((g) => g.toLowerCase().includes(q))) ||
        m.language.toLowerCase().includes(q)
    );
  }, [movies, movieSearch]);

  const filteredShows = useMemo(() => {
    return shows.filter((s) => {
      const movieId = s.movie?._id || s.movie;
      const movieMatches = showMovieFilter === 'All' || movieId === showMovieFilter;
      const q = showSearch.toLowerCase();
      const searchMatches =
        !q ||
        s.theatreName.toLowerCase().includes(q) ||
        s.screen.toLowerCase().includes(q) ||
        (s.movie?.title && s.movie.title.toLowerCase().includes(q));
      return movieMatches && searchMatches;
    });
  }, [shows, showMovieFilter, showSearch]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const statusMatches = bookingStatusFilter === 'All' || b.status === bookingStatusFilter;
      const q = bookingSearch.toLowerCase();
      const searchMatches =
        !q ||
        b._id.toLowerCase().includes(q) ||
        b.user?.email?.toLowerCase().includes(q) ||
        b.user?.name?.toLowerCase().includes(q) ||
        b.show?.movie?.title?.toLowerCase().includes(q) ||
        b.show?.theatreName?.toLowerCase().includes(q);
      return statusMatches && searchMatches;
    });
  }, [bookings, bookingSearch, bookingStatusFilter]);

  // Current list for active tab
  const currentItems = useMemo(() => {
    if (activeTab === 'movies') return filteredMovies;
    if (activeTab === 'shows') return filteredShows;
    return filteredBookings;
  }, [activeTab, filteredMovies, filteredShows, filteredBookings]);

  const totalPages = Math.max(1, Math.ceil(currentItems.length / perPage));
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * perPage;
    return currentItems.slice(start, start + perPage);
  }, [currentItems, page, perPage]);

  return (
    <div className="container-fluid" style={{ maxWidth: '1440px', padding: '32px 24px' }}>
      {/* Top Header */}
      <PageHeader
        title="Admin Control Center"
        subtitle="Manage movie catalog, show schedules, and customer bookings"
        actions={
          <Button
            variant="outline"
            size="sm"
            icon={<FiRefreshCw size={14} />}
            onClick={loadAllData}
          >
            Refresh Data
          </Button>
        }
      />

      <div className="row g-4">
        {/* ================= LEFT SIDEBAR ================= */}
        <div className="col-lg-3 col-md-4">
          <Card
            style={{
              padding: '20px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              marginBottom: '20px',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
              Navigation Menu
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('movies')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: activeTab === 'movies' ? '1px solid var(--accent)' : '1px solid transparent',
                  backgroundColor: activeTab === 'movies' ? 'var(--bg-surface-alt)' : 'transparent',
                  color: activeTab === 'movies' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: activeTab === 'movies' ? 600 : 500,
                  fontSize: '14px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FiFilm size={16} style={{ color: activeTab === 'movies' ? 'var(--accent)' : 'inherit' }} />
                  <span>Movies Catalog</span>
                </div>
                <Badge variant={activeTab === 'movies' ? 'accent' : 'neutral'}>
                  {movies.length}
                </Badge>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('shows')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: activeTab === 'shows' ? '1px solid var(--accent)' : '1px solid transparent',
                  backgroundColor: activeTab === 'shows' ? 'var(--bg-surface-alt)' : 'transparent',
                  color: activeTab === 'shows' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: activeTab === 'shows' ? 600 : 500,
                  fontSize: '14px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FiCalendar size={16} style={{ color: activeTab === 'shows' ? 'var(--accent)' : 'inherit' }} />
                  <span>Show Schedules</span>
                </div>
                <Badge variant={activeTab === 'shows' ? 'accent' : 'neutral'}>
                  {shows.length}
                </Badge>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('bookings')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: activeTab === 'bookings' ? '1px solid var(--accent)' : '1px solid transparent',
                  backgroundColor: activeTab === 'bookings' ? 'var(--bg-surface-alt)' : 'transparent',
                  color: activeTab === 'bookings' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: activeTab === 'bookings' ? 600 : 500,
                  fontSize: '14px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FiBookOpen size={16} style={{ color: activeTab === 'bookings' ? 'var(--accent)' : 'inherit' }} />
                  <span>Customer Bookings</span>
                </div>
                <Badge variant={activeTab === 'bookings' ? 'accent' : 'neutral'}>
                  {bookings.length}
                </Badge>
              </button>
            </div>
          </Card>

          {/* Quick Stats sidebar info */}
          <Card
            style={{
              padding: '20px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
              System Status
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Backend API:</span>
                <span style={{ color: 'var(--success)', fontWeight: 600 }}>Port 5000 Active</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Database:</span>
                <span style={{ color: 'var(--text-primary)' }}>MongoDB Local</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Role:</span>
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Superadmin</span>
              </div>
            </div>
          </Card>
        </div>

        {/* ================= RIGHT MAIN PANEL ================= */}
        <div className="col-lg-9 col-md-8">
          {/* STAT CARDS ON TOP */}
          <div className="row g-3" style={{ marginBottom: '24px' }}>
            <div className="col-xl-3 col-sm-6">
              <Card
                style={{
                  padding: '20px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(229, 9, 20, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent)',
                    flexShrink: 0,
                  }}
                >
                  <FiFilm size={22} />
                </div>
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500 }}>Total Movies</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {stats.totalMovies}
                  </div>
                </div>
              </Card>
            </div>

            <div className="col-xl-3 col-sm-6">
              <Card
                style={{
                  padding: '20px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(58, 58, 72, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-primary)',
                    flexShrink: 0,
                  }}
                >
                  <FiCalendar size={22} />
                </div>
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500 }}>Total Shows</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {stats.totalShows}
                  </div>
                </div>
              </Card>
            </div>

            <div className="col-xl-3 col-sm-6">
              <Card
                style={{
                  padding: '20px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(46, 204, 113, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--success)',
                    flexShrink: 0,
                  }}
                >
                  <FiBookOpen size={22} />
                </div>
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500 }}>Total Bookings</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {stats.totalBookings}
                  </div>
                </div>
              </Card>
            </div>

            <div className="col-xl-3 col-sm-6">
              <Card
                style={{
                  padding: '20px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(46, 204, 113, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--success)',
                    flexShrink: 0,
                  }}
                >
                  <FiDollarSign size={22} />
                </div>
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500 }}>Total Revenue</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--success)' }}>
                    ${stats.revenue.toFixed(2)}
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* MAIN DATA SECTION */}
          <Card
            style={{
              padding: '24px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
            }}
          >
            {/* Top Toolbar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>
                  {activeTab === 'movies' && 'Movies Catalog'}
                  {activeTab === 'shows' && 'Showtime Schedules'}
                  {activeTab === 'bookings' && 'Customer Reservations'}
                </h2>

                {activeTab === 'shows' && (
                  <select
                    className="ui-input"
                    value={showMovieFilter}
                    onChange={(e) => setShowMovieFilter(e.target.value)}
                    style={{ padding: '6px 12px', fontSize: '13px', width: 'auto' }}
                  >
                    <option value="All">All Movies</option>
                    {movies.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.title}
                      </option>
                    ))}
                  </select>
                )}

                {activeTab === 'bookings' && (
                  <select
                    className="ui-input"
                    value={bookingStatusFilter}
                    onChange={(e) => setBookingStatusFilter(e.target.value)}
                    style={{ padding: '6px 12px', fontSize: '13px', width: 'auto' }}
                  >
                    <option value="All">All Statuses</option>
                    <option value="confirmed">Confirmed Only</option>
                    <option value="cancelled">Cancelled Only</option>
                  </select>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                {/* Search Bar */}
                <div style={{ position: 'relative', width: '220px' }}>
                  <FiSearch
                    size={14}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-secondary)',
                    }}
                  />
                  <input
                    type="text"
                    className="ui-input"
                    placeholder={`Search ${activeTab}...`}
                    value={
                      activeTab === 'movies'
                        ? movieSearch
                        : activeTab === 'shows'
                        ? showSearch
                        : bookingSearch
                    }
                    onChange={(e) => {
                      if (activeTab === 'movies') setMovieSearch(e.target.value);
                      else if (activeTab === 'shows') setShowSearch(e.target.value);
                      else setBookingSearch(e.target.value);
                    }}
                    style={{ paddingLeft: '34px', paddingRight: '12px', height: '38px', fontSize: '13px' }}
                  />
                </div>

                {/* Primary Action Button */}
                {activeTab === 'movies' && (
                  <Button variant="primary" size="sm" icon={<FiPlus size={16} />} onClick={openAddMovieModal}>
                    Add Movie
                  </Button>
                )}
                {activeTab === 'shows' && (
                  <Button variant="primary" size="sm" icon={<FiPlus size={16} />} onClick={openAddShowModal}>
                    Add Show
                  </Button>
                )}
              </div>
            </div>

            {/* TAB CONTENT TABLES */}
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Skeleton width="100%" height="40px" />
                <Skeleton width="100%" height="40px" />
                <Skeleton width="100%" height="40px" />
              </div>
            ) : paginatedItems.length === 0 ? (
              <div style={{ padding: '48px 0' }}>
                <EmptyState
                  title={`No ${activeTab} found`}
                  description="No records match your search criteria or the database is empty."
                />
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                      {activeTab === 'movies' && (
                        <>
                          <th style={{ padding: '12px 16px' }}>Movie</th>
                          <th style={{ padding: '12px 16px' }}>Genre</th>
                          <th style={{ padding: '12px 16px' }}>Language</th>
                          <th style={{ padding: '12px 16px' }}>Duration</th>
                          <th style={{ padding: '12px 16px' }}>Rating</th>
                          <th style={{ padding: '12px 16px' }}>Status</th>
                          <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                        </>
                      )}
                      {activeTab === 'shows' && (
                        <>
                          <th style={{ padding: '12px 16px' }}>Movie</th>
                          <th style={{ padding: '12px 16px' }}>Theatre</th>
                          <th style={{ padding: '12px 16px' }}>Screen</th>
                          <th style={{ padding: '12px 16px' }}>Date & Time</th>
                          <th style={{ padding: '12px 16px' }}>Price</th>
                          <th style={{ padding: '12px 16px' }}>Booked</th>
                          <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                        </>
                      )}
                      {activeTab === 'bookings' && (
                        <>
                          <th style={{ padding: '12px 16px' }}>Booking ID</th>
                          <th style={{ padding: '12px 16px' }}>User</th>
                          <th style={{ padding: '12px 16px' }}>Movie</th>
                          <th style={{ padding: '12px 16px' }}>Date & Showtime</th>
                          <th style={{ padding: '12px 16px' }}>Seats</th>
                          <th style={{ padding: '12px 16px' }}>Total</th>
                          <th style={{ padding: '12px 16px' }}>Status</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {/* MOVIES ROWS */}
                    {activeTab === 'movies' &&
                      paginatedItems.map((m) => (
                        <tr
                          key={m._id}
                          style={{
                            borderBottom: '1px solid var(--border-color)',
                            transition: 'background-color 0.2s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-alt)')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <img
                                src={m.posterUrl}
                                alt={m.title}
                                style={{ width: '38px', height: '54px', objectFit: 'cover', borderRadius: '4px' }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://via.placeholder.com/38x54/1A1A23/FFFFFF?text=M';
                                }}
                              />
                              <div>
                                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.title}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                  Released: {new Date(m.releaseDate).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                            {Array.isArray(m.genre) ? m.genre.join(', ') : m.genre}
                          </td>
                          <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{m.language}</td>
                          <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{m.duration}m</td>
                          <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                            ★ {m.rating ? m.rating.toFixed(1) : '8.0'}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            {m.isActive ? (
                              <Badge variant="success">Active</Badge>
                            ) : (
                              <Badge variant="neutral">Inactive</Badge>
                            )}
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                              <button
                                type="button"
                                onClick={() => openEditMovieModal(m)}
                                style={{
                                  background: 'none',
                                  border: '1px solid var(--border-color)',
                                  color: 'var(--text-secondary)',
                                  padding: '6px',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                }}
                                title="Edit Movie"
                              >
                                <FiEdit2 size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteModal({
                                    isOpen: true,
                                    type: 'movie',
                                    id: m._id,
                                    title: m.title,
                                  })
                                }
                                style={{
                                  background: 'none',
                                  border: '1px solid var(--border-color)',
                                  color: 'var(--danger)',
                                  padding: '6px',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                }}
                                title="Delete Movie"
                              >
                                <FiTrash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                    {/* SHOWS ROWS */}
                    {activeTab === 'shows' &&
                      paginatedItems.map((s) => (
                        <tr
                          key={s._id}
                          style={{
                            borderBottom: '1px solid var(--border-color)',
                            transition: 'background-color 0.2s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-alt)')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {s.movie?.title || 'Unknown Movie'}
                          </td>
                          <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{s.theatreName}</td>
                          <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{s.screen}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ color: 'var(--text-primary)' }}>{s.date}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{s.time}</div>
                          </td>
                          <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                            ${s.price.toFixed(2)}
                          </td>
                          <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                            {s.bookedSeats ? s.bookedSeats.length : 0} / {s.totalSeats || 100}
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                              <button
                                type="button"
                                onClick={() => openEditShowModal(s)}
                                style={{
                                  background: 'none',
                                  border: '1px solid var(--border-color)',
                                  color: 'var(--text-secondary)',
                                  padding: '6px',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                }}
                                title="Edit Show"
                              >
                                <FiEdit2 size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteModal({
                                    isOpen: true,
                                    type: 'show',
                                    id: s._id,
                                    title: `${s.movie?.title || 'Show'} (${s.date} ${s.time})`,
                                  })
                                }
                                style={{
                                  background: 'none',
                                  border: '1px solid var(--border-color)',
                                  color: 'var(--danger)',
                                  padding: '6px',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                }}
                                title="Delete Show"
                              >
                                <FiTrash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                    {/* BOOKINGS ROWS */}
                    {activeTab === 'bookings' &&
                      paginatedItems.map((b) => (
                        <tr
                          key={b._id}
                          style={{
                            borderBottom: '1px solid var(--border-color)',
                            transition: 'background-color 0.2s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-alt)')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '13px', color: 'var(--text-secondary)' }}>
                            {b._id.slice(-8)}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{b.user?.name || 'Customer'}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{b.user?.email}</div>
                          </td>
                          <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: 600 }}>
                            {b.show?.movie?.title || 'Movie'}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ color: 'var(--text-primary)' }}>{b.show?.date}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{b.show?.time}</div>
                          </td>
                          <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {b.seats?.join(', ')}
                          </td>
                          <td style={{ padding: '12px 16px', fontWeight: 700, color: b.status === 'confirmed' ? 'var(--success)' : 'var(--text-secondary)' }}>
                            ${b.totalAmount?.toFixed(2)}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            {b.status === 'confirmed' ? (
                              <Badge variant="success">Confirmed</Badge>
                            ) : (
                              <Badge variant="danger">Cancelled</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-color)',
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                }}
              >
                <div>
                  Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, currentItems.length)} of {currentItems.length} entries
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    icon={<FiChevronLeft size={14} />}
                  >
                    Previous
                  </Button>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '0 12px',
                      color: 'var(--text-primary)',
                      fontWeight: 600,
                    }}
                  >
                    {page} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    icon={<FiChevronRight size={14} />}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* ================= ADD/EDIT MOVIE MODAL ================= */}
      <Modal
        isOpen={movieModalOpen}
        onClose={() => setMovieModalOpen(false)}
        title={editingMovie ? 'Edit Movie' : 'Add New Movie'}
        maxWidth="640px"
        footer={
          <>
            <Button variant="outline" onClick={() => setMovieModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleMovieSubmit}>
              {editingMovie ? 'Update Movie' : 'Create Movie'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleMovieSubmit}>
          <div className="row g-3">
            <div className="col-12">
              <Input
                label="Movie Title"
                value={movieFormData.title}
                onChange={(e) => setMovieFormData({ ...movieFormData, title: e.target.value })}
                error={movieErrors.title}
                required
              />
            </div>

            <div className="col-12">
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Description <span style={{ color: 'var(--accent)' }}>*</span>
                </label>
                <textarea
                  className="ui-input"
                  rows={3}
                  value={movieFormData.description}
                  onChange={(e) => setMovieFormData({ ...movieFormData, description: e.target.value })}
                  style={{ width: '100%', borderColor: movieErrors.description ? 'var(--danger)' : undefined }}
                  required
                />
                {movieErrors.description && (
                  <div style={{ color: 'var(--danger)', fontSize: '13px', marginTop: '4px' }}>
                    {movieErrors.description}
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <Input
                label="Genre (comma separated)"
                placeholder="Action, Sci-Fi, Adventure"
                value={movieFormData.genre}
                onChange={(e) => setMovieFormData({ ...movieFormData, genre: e.target.value })}
                error={movieErrors.genre}
                required
              />
            </div>

            <div className="col-md-6">
              <Input
                label="Language"
                value={movieFormData.language}
                onChange={(e) => setMovieFormData({ ...movieFormData, language: e.target.value })}
                required
              />
            </div>

            <div className="col-md-4">
              <Input
                label="Duration (minutes)"
                type="number"
                value={movieFormData.duration}
                onChange={(e) => setMovieFormData({ ...movieFormData, duration: e.target.value })}
                required
              />
            </div>

            <div className="col-md-4">
              <Input
                label="Rating (out of 10)"
                type="number"
                step="0.1"
                min="1"
                max="10"
                value={movieFormData.rating}
                onChange={(e) => setMovieFormData({ ...movieFormData, rating: e.target.value })}
                required
              />
            </div>

            <div className="col-md-4">
              <Input
                label="Release Date"
                type="date"
                value={movieFormData.releaseDate}
                onChange={(e) => setMovieFormData({ ...movieFormData, releaseDate: e.target.value })}
                required
              />
            </div>

            <div className="col-12">
              <Input
                label="Poster Image URL"
                placeholder="https://..."
                value={movieFormData.posterUrl}
                onChange={(e) => setMovieFormData({ ...movieFormData, posterUrl: e.target.value })}
                error={movieErrors.posterUrl}
                required
              />
            </div>

            <div className="col-12">
              <Input
                label="Trailer YouTube Embed URL"
                placeholder="https://www.youtube.com/embed/..."
                value={movieFormData.trailerUrl}
                onChange={(e) => setMovieFormData({ ...movieFormData, trailerUrl: e.target.value })}
              />
            </div>

            <div className="col-12">
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: 'var(--text-primary)' }}>
                <input
                  type="checkbox"
                  checked={movieFormData.isActive}
                  onChange={(e) => setMovieFormData({ ...movieFormData, isActive: e.target.checked })}
                />
                <span>Active in Cinema Listing</span>
              </label>
            </div>
          </div>
        </form>
      </Modal>

      {/* ================= ADD/EDIT SHOW MODAL ================= */}
      <Modal
        isOpen={showModalOpen}
        onClose={() => setShowModalOpen(false)}
        title={editingShow ? 'Edit Show' : 'Add New Show'}
        maxWidth="600px"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleShowSubmit}>
              {editingShow ? 'Update Show' : 'Create Show'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleShowSubmit}>
          <div className="row g-3">
            <div className="col-12">
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Select Movie <span style={{ color: 'var(--accent)' }}>*</span>
              </label>
              <select
                className="ui-input"
                value={showFormData.movie}
                onChange={(e) => setShowFormData({ ...showFormData, movie: e.target.value })}
                required
              >
                <option value="">-- Choose Movie --</option>
                {movies.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.title} ({m.language})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <Input
                label="Theatre Name"
                value={showFormData.theatreName}
                onChange={(e) => setShowFormData({ ...showFormData, theatreName: e.target.value })}
                error={showErrors.theatreName}
                required
              />
            </div>

            <div className="col-md-6">
              <Input
                label="Screen"
                value={showFormData.screen}
                onChange={(e) => setShowFormData({ ...showFormData, screen: e.target.value })}
                error={showErrors.screen}
                required
              />
            </div>

            <div className="col-md-6">
              <Input
                label="Date"
                type="date"
                value={showFormData.date}
                onChange={(e) => setShowFormData({ ...showFormData, date: e.target.value })}
                error={showErrors.date}
                required
              />
            </div>

            <div className="col-md-6">
              <Input
                label="Time (e.g. 06:30 PM)"
                value={showFormData.time}
                onChange={(e) => setShowFormData({ ...showFormData, time: e.target.value })}
                error={showErrors.time}
                required
              />
            </div>

            <div className="col-md-6">
              <Input
                label="Ticket Price ($)"
                type="number"
                step="0.5"
                min="1"
                value={showFormData.price}
                onChange={(e) => setShowFormData({ ...showFormData, price: e.target.value })}
                required
              />
            </div>

            <div className="col-md-6">
              <Input
                label="Total Capacity Seats"
                type="number"
                value={showFormData.totalSeats}
                onChange={(e) => setShowFormData({ ...showFormData, totalSeats: e.target.value })}
                required
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, type: '', id: null, title: '' })}
        title={`Confirm Delete ${deleteModal.type === 'movie' ? 'Movie' : 'Show'}`}
        maxWidth="480px"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, type: '', id: null, title: '' })}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              Delete Record
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <FiAlertTriangle size={24} style={{ color: 'var(--danger)', flexShrink: 0 }} />
          <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
            Are you sure you want to permanently delete <strong>{deleteModal.title}</strong>?
          </div>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
          This operation cannot be undone. Associated records and historical queries may be affected.
        </p>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
