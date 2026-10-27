import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { FiStar, FiSearch, FiFilm, FiCalendar, FiClock, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [sortBy, setSortBy] = useState('rating'); // 'rating' | 'releaseDate' | 'title'
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    fetchMovies();
  }, [selectedGenre, selectedLanguage]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const params = {};
      if (selectedGenre !== 'All') params.genre = selectedGenre;
      if (selectedLanguage !== 'All') params.language = selectedLanguage;

      const res = await API.get('/movies', { params });
      if (res.data?.success && Array.isArray(res.data.data)) {
        setMovies(res.data.data);
      } else if (Array.isArray(res.data)) {
        setMovies(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch movies:', err);
      setFetchError(err.response?.data?.message || err.message || 'Cannot connect to movie server');
    } finally {
      setLoading(false);
    }
  };

  // Filter & Sort
  const filteredMovies = useMemo(() => {
    let list = [...movies];
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.genre.some((g) => g.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'releaseDate') {
      list.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    } else if (sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [movies, search, sortBy]);

  // Top Rated for Hero Billboard
  const featuredMovies = useMemo(() => {
    return [...movies].sort((a, b) => b.rating - a.rating).slice(0, 4);
  }, [movies]);

  // Section 1: Now Showing
  const nowShowing = useMemo(() => {
    return filteredMovies.slice(0, 8);
  }, [filteredMovies]);

  // Section 2: Top Rated
  const topRated = useMemo(() => {
    return [...movies].sort((a, b) => b.rating - a.rating).slice(0, 6);
  }, [movies]);

  // Section 3: Coming Soon / Spotlight
  const comingSoon = useMemo(() => {
    return [...movies].sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)).slice(0, 6);
  }, [movies]);

  // Auto-advance hero carousel
  useEffect(() => {
    if (featuredMovies.length === 0) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % featuredMovies.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featuredMovies]);

  const genres = [
    'All',
    'Action',
    'Sci-Fi',
    'Adventure',
    'Drama',
    'Crime',
    'Biography',
    'Animation',
  ];

  const languages = ['All', 'English', 'Spanish', 'French', 'Hindi'];

  const resetFilters = () => {
    setSearch('');
    setSelectedGenre('All');
    setSelectedLanguage('All');
    setSortBy('rating');
  };

  const currentHero = featuredMovies[activeSlide] || null;

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', paddingBottom: '64px' }}>
      {/* ================= 1. HERO CAROUSEL ================= */}
      {currentHero && (
        <section
          style={{
            position: 'relative',
            backgroundColor: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-color)',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Ambient Wallpaper */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${currentHero.posterUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 20%',
              opacity: 0.18,
              filter: 'blur(10px)',
            }}
          />

          <div
            className="container"
            style={{
              position: 'relative',
              zIndex: 1,
              paddingTop: '64px',
              paddingBottom: '64px',
              minHeight: '480px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div style={{ maxWidth: '680px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Badge variant="accent">Featured Premiere</Badge>
                <Badge variant="neutral" icon={<FiStar style={{ color: 'var(--accent)' }} />}>
                  {currentHero.rating.toFixed(1)} / 10
                </Badge>
                <Badge variant="neutral">{currentHero.language}</Badge>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {Math.floor(currentHero.duration / 60)}h {currentHero.duration % 60}m
                </span>
              </div>

              <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>
                {currentHero.title}
              </h1>

              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '16px',
                  lineHeight: 1.6,
                  marginBottom: '24px',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {currentHero.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
                {currentHero.genre.map((g) => (
                  <Badge key={g} variant="neutral">
                    {g}
                  </Badge>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Link to={`/movies/${currentHero._id}`}>
                  <Button variant="primary" size="lg" icon={<FiFilm />}>
                    Book Tickets
                  </Button>
                </Link>
                {currentHero.trailerUrl && (
                  <Link to={`/movies/${currentHero._id}?trailer=1`}>
                    <Button variant="outline" size="lg">
                      Watch Trailer
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Carousel navigation controls */}
            <div
              style={{
                position: 'absolute',
                bottom: '24px',
                right: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setActiveSlide((prev) => (prev === 0 ? featuredMovies.length - 1 : prev - 1))
                }
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-surface-alt)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="Previous featured movie"
              >
                <FiChevronLeft size={18} />
              </button>

              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', padding: '0 8px' }}>
                {activeSlide + 1} / {featuredMovies.length}
              </span>

              <button
                type="button"
                onClick={() =>
                  setActiveSlide((prev) => (prev + 1) % featuredMovies.length)
                }
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-surface-alt)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="Next featured movie"
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ================= 2. FILTER & SEARCH BAR ================= */}
      <section className="container" style={{ marginTop: '32px', marginBottom: '32px' }}>
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1 1 280px', minWidth: '240px' }}>
            <span
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)',
                display: 'flex',
              }}
            >
              <FiSearch size={16} />
            </span>
            <input
              type="text"
              placeholder="Search movies by title or genre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ui-input"
              style={{ paddingLeft: '38px', height: '40px' }}
            />
          </div>

          {/* Controls: Language and Sort */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="ui-input"
              style={{ width: 'auto', height: '40px', padding: '0 12px' }}
            >
              <option value="All">All Languages</option>
              {languages.filter((l) => l !== 'All').map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="ui-input"
              style={{ width: 'auto', height: '40px', padding: '0 12px' }}
            >
              <option value="rating">Sort: Top Rated</option>
              <option value="releaseDate">Sort: Latest Release</option>
              <option value="title">Sort: Title (A-Z)</option>
            </select>

            {(search || selectedGenre !== 'All' || selectedLanguage !== 'All') && (
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Genre Pill Chips */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingTop: '16px',
            paddingBottom: '8px',
          }}
        >
          {genres.map((g) => {
            const active = selectedGenre === g;
            return (
              <button
                key={g}
                type="button"
                onClick={() => setSelectedGenre(g)}
                style={{
                  backgroundColor: active ? 'var(--accent)' : 'var(--bg-surface)',
                  color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                  border: `1px solid ${active ? 'var(--accent)' : 'var(--border-color)'}`,
                  borderRadius: '100px',
                  padding: '6px 14px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'background-color 0.2s ease, border-color 0.2s ease',
                }}
              >
                {g}
              </button>
            );
          })}
        </div>
      </section>

      {/* ================= 3. MOVIE SECTIONS ================= */}
      <div className="container">
        {fetchError ? (
          <EmptyState
            icon={<FiFilm size={36} />}
            title="Unable to load movies"
            description={`Could not reach the movie catalog (${fetchError}). Please verify the backend is running on port 5000.`}
            actionText="Retry Loading Movies"
            onAction={fetchMovies}
          />
        ) : loading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '24px',
              paddingTop: '16px',
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '12px',
                }}
              >
                <Skeleton height="280px" borderRadius="8px" style={{ marginBottom: '12px' }} />
                <Skeleton height="18px" width="80%" style={{ marginBottom: '8px' }} />
                <Skeleton height="14px" width="50%" style={{ marginBottom: '12px' }} />
                <Skeleton height="36px" width="100%" />
              </div>
            ))}
          </div>
        ) : filteredMovies.length === 0 ? (
          <EmptyState
            icon={<FiFilm size={36} />}
            title="No movies found"
            description="We couldn't find any movie matching your current query or filters."
            actionText="Reset All Filters"
            onAction={resetFilters}
          />
        ) : (
          <>
            {/* Section 1: Now Showing */}
            <div style={{ marginBottom: '48px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                }}
              >
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Now Showing</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '4px 0 0 0' }}>
                    Currently screening in participating cinemas
                  </p>
                </div>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {filteredMovies.length} Available
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                  gap: '24px',
                }}
              >
                {nowShowing.map((movie) => (
                  <MovieCard key={movie._id} movie={movie} />
                ))}
              </div>
            </div>

            {/* Section 2: Top Rated Blockbusters */}
            {topRated.length > 0 && !search && selectedGenre === 'All' && (
              <div style={{ marginBottom: '48px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Top Rated Blockbusters</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '4px 0 0 0' }}>
                    Highest rated cinematic experiences voted by viewers
                  </p>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                    gap: '24px',
                  }}
                >
                  {topRated.map((movie) => (
                    <MovieCard key={`top-${movie._id}`} movie={movie} />
                  ))}
                </div>
              </div>
            )}

            {/* Section 3: Spotlight Releases */}
            {comingSoon.length > 0 && !search && selectedGenre === 'All' && (
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Latest Premieres</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '4px 0 0 0' }}>
                    Freshly added releases ready for ticket reservations
                  </p>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                    gap: '24px',
                  }}
                >
                  {comingSoon.map((movie) => (
                    <MovieCard key={`coming-${movie._id}`} movie={movie} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Reusable Movie Card Component
const MovieCard = ({ movie }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="ui-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '12px',
        backgroundColor: 'var(--bg-surface)',
        transform: isHovered ? 'translateY(-4px)' : 'none',
        borderColor: isHovered ? 'var(--accent)' : 'var(--border-color)',
      }}
    >
      {/* 2:3 Poster Container */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '2 / 3',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-surface-alt)',
          marginBottom: '12px',
        }}
      >
        <img
          src={movie.posterUrl}
          alt={movie.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: isHovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.2s ease',
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x450/1A1A23/FFFFFF?text=No+Poster';
          }}
        />

        {/* Rating Badge */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <FiStar size={12} style={{ color: 'var(--accent)' }} />
          <span>{movie.rating.toFixed(1)}</span>
        </div>

        {/* Hover Book Overlay Button */}
        {isHovered && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(15, 15, 20, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            <Link to={`/movies/${movie._id}`} style={{ width: '100%' }}>
              <Button variant="primary" style={{ width: '100%' }} icon={<FiFilm />}>
                Book Now
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Movie Details */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3
          style={{
            fontSize: '16px',
            fontWeight: 700,
            margin: '0 0 4px 0',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title={movie.title}
        >
          {movie.title}
        </h3>

        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          {movie.language} &bull; {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
          {movie.genre.slice(0, 2).map((g) => (
            <Badge key={g} variant="neutral" style={{ fontSize: '11px', padding: '2px 8px' }}>
              {g}
            </Badge>
          ))}
          {movie.genre.length > 2 && (
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', alignSelf: 'center' }}>
              +{movie.genre.length - 2}
            </span>
          )}
        </div>

        <Link to={`/movies/${movie._id}`} style={{ marginTop: 'auto' }}>
          <Button variant="secondary" size="sm" style={{ width: '100%' }}>
            Select Seats
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
