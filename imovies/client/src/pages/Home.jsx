import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { mockMovies } from '../services/mockData';
import {
  FiStar,
  FiSearch,
  FiFilm,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiPlay,
  FiTrendingUp,
  FiAward,
  FiCalendar,
} from 'react-icons/fi';
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
      let movieData = [];
      if (res.data?.success && Array.isArray(res.data.data)) {
        movieData = res.data.data;
      } else if (Array.isArray(res.data)) {
        movieData = res.data;
      }

      // If backend returned empty list, fall back to built-in movie catalog
      if (movieData.length === 0) {
        let fallback = [...mockMovies];
        if (selectedGenre !== 'All') {
          fallback = fallback.filter((m) => m.genre?.includes(selectedGenre));
        }
        if (selectedLanguage !== 'All') {
          fallback = fallback.filter((m) => m.language === selectedLanguage);
        }
        movieData = fallback;
      }

      setMovies(movieData);
    } catch (err) {
      console.warn('API error, using built-in catalog fallback:', err);
      let fallback = [...mockMovies];
      if (selectedGenre !== 'All') {
        fallback = fallback.filter((m) => m.genre?.includes(selectedGenre));
      }
      if (selectedLanguage !== 'All') {
        fallback = fallback.filter((m) => m.language === selectedLanguage);
      }
      setMovies(fallback);
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
          m.genre.some((g) => g.toLowerCase().includes(q)) ||
          m.description.toLowerCase().includes(q)
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

  // Section 1: Featured for Carousel
  const featuredMovies = useMemo(() => {
    return filteredMovies.filter((m) => m.rating >= 8.5).slice(0, 5);
  }, [filteredMovies]);

  // Section 2: Now Showing
  const nowShowing = useMemo(() => {
    return filteredMovies.slice(0, 8);
  }, [filteredMovies]);

  // Section 3: Top Rated
  const topRated = useMemo(() => {
    return [...movies].sort((a, b) => b.rating - a.rating).slice(0, 6);
  }, [movies]);

  // Section 4: Coming Soon / Spotlight
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
    'Romance',
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
    <div style={{ backgroundColor: 'var(--bg-main)', paddingBottom: '80px', minHeight: '100vh' }}>
      {/* ================= 1. HERO CAROUSEL ================= */}
      {currentHero && (
        <section
          style={{
            position: 'relative',
            minHeight: '520px',
            backgroundColor: '#090B10',
            overflow: 'hidden',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Ambient Poster Backdrop with Cinematic Gradients */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${currentHero.posterUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 25%',
              opacity: 0.28,
              filter: 'blur(16px)',
              transform: 'scale(1.08)',
              transition: 'all 0.8s ease',
            }}
          />

          {/* Vignette & Spotlight Overlays */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, #0B0D14 0%, rgba(11, 13, 20, 0.85) 45%, rgba(11, 13, 20, 0.5) 100%), linear-gradient(to right, #0B0D14 20%, rgba(11, 13, 20, 0.75) 55%, transparent 100%)',
            }}
          />

          <div
            className="container"
            style={{
              position: 'relative',
              zIndex: 2,
              paddingTop: '72px',
              paddingBottom: '72px',
              minHeight: '520px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div style={{ maxWidth: '680px' }}>
              {/* Badges Bar */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '18px',
                }}
              >
                <Badge variant="accent">Exclusive Premiere</Badge>
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
                  <span>{currentHero.rating.toFixed(1)} / 10</span>
                </div>
                <Badge variant="neutral">{currentHero.language}</Badge>
                <span
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <FiClock size={14} />
                  <span>
                    {Math.floor(currentHero.duration / 60)}h {currentHero.duration % 60}m
                  </span>
                </span>
              </div>

              {/* Title */}
              <h1
                style={{
                  fontSize: '44px',
                  fontWeight: 900,
                  lineHeight: 1.1,
                  marginBottom: '16px',
                  letterSpacing: '-0.03em',
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {currentHero.title}
              </h1>

              {/* Description */}
              <p
                style={{
                  color: '#CBD5E1',
                  fontSize: '16px',
                  lineHeight: 1.65,
                  marginBottom: '24px',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                }}
              >
                {currentHero.description}
              </p>

              {/* Genre Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
                {currentHero.genre.map((g) => (
                  <span
                    key={g}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      background: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                <Link to={`/movies/${currentHero._id}`}>
                  <Button
                    variant="primary"
                    size="lg"
                    icon={<FiFilm size={18} />}
                    style={{ borderRadius: '14px', padding: '14px 28px' }}
                  >
                    Book Tickets Now
                  </Button>
                </Link>
                {currentHero.trailerUrl && (
                  <Link to={`/movies/${currentHero._id}?trailer=1`}>
                    <Button
                      variant="outline"
                      size="lg"
                      icon={<FiPlay size={18} />}
                      style={{ borderRadius: '14px', padding: '14px 24px' }}
                    >
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
                bottom: '32px',
                right: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setActiveSlide((prev) => (prev === 0 ? featuredMovies.length - 1 : prev - 1))
                }
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(23, 29, 46, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
                aria-label="Previous featured movie"
              >
                <FiChevronLeft size={20} />
              </button>

              {/* Dots */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {featuredMovies.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveSlide(idx)}
                    style={{
                      width: activeSlide === idx ? '24px' : '8px',
                      height: '8px',
                      borderRadius: '100px',
                      backgroundColor:
                        activeSlide === idx ? 'var(--accent-light)' : 'rgba(255, 255, 255, 0.2)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      padding: 0,
                    }}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  setActiveSlide((prev) => (prev + 1) % featuredMovies.length)
                }
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(23, 29, 46, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
                aria-label="Next featured movie"
              >
                <FiChevronRight size={20} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ================= 2. FILTER & SEARCH BAR ================= */}
      <section className="container" style={{ marginTop: '40px', marginBottom: '40px' }}>
        <div
          style={{
            backgroundColor: 'rgba(19, 23, 36, 0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '20px 24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '18px',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
          }}
        >
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1 1 300px', minWidth: '240px' }}>
            <span
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-tertiary)',
                display: 'flex',
              }}
            >
              <FiSearch size={18} />
            </span>
            <input
              type="text"
              placeholder="Search movies by title, genre, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ui-input"
              style={{ paddingLeft: '42px', height: '44px', borderRadius: '12px' }}
            />
          </div>

          {/* Controls: Language and Sort */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="ui-input"
              style={{
                width: 'auto',
                height: '44px',
                padding: '0 14px',
                borderRadius: '12px',
                cursor: 'pointer',
              }}
            >
              <option value="All">All Languages</option>
              {languages
                .filter((l) => l !== 'All')
                .map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="ui-input"
              style={{
                width: 'auto',
                height: '44px',
                padding: '0 14px',
                borderRadius: '12px',
                cursor: 'pointer',
              }}
            >
              <option value="rating">Top Rated Blockbusters</option>
              <option value="releaseDate">Latest Releases</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>

            {(search || selectedGenre !== 'All' || selectedLanguage !== 'All') && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                style={{ borderRadius: '12px', height: '44px', padding: '0 16px' }}
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Genre Pill Chips */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            paddingTop: '18px',
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
                className={`ui-filter-pill ${active ? 'active' : ''}`}
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
            icon={<FiFilm size={40} />}
            title="Unable to load movies"
            description={`Could not reach the movie catalog (${fetchError}). Please verify the backend is running.`}
            actionText="Retry Loading Movies"
            onAction={fetchMovies}
          />
        ) : loading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
              gap: '28px',
              paddingTop: '20px',
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                style={{
                  backgroundColor: 'var(--bg-surface-solid)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '14px',
                }}
              >
                <Skeleton height="320px" borderRadius="12px" style={{ marginBottom: '14px' }} />
                <Skeleton height="20px" width="75%" style={{ marginBottom: '8px' }} />
                <Skeleton height="14px" width="45%" style={{ marginBottom: '14px' }} />
                <Skeleton height="40px" width="100%" borderRadius="10px" />
              </div>
            ))}
          </div>
        ) : filteredMovies.length === 0 ? (
          <EmptyState
            icon={<FiFilm size={40} />}
            title="No movies found"
            description="We couldn't find any movie matching your current query or filters."
            actionText="Reset All Filters"
            onAction={resetFilters}
          />
        ) : (
          <>
            {/* Section 1: Now Showing */}
            <div style={{ marginBottom: '60px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '24px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiTrendingUp style={{ color: 'var(--accent-light)' }} size={22} />
                    <h2 style={{ fontSize: '26px', fontWeight: 800, margin: 0 }}>Now Showing</h2>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '6px 0 0 0' }}>
                    Currently screening in participating IMAX & Dolby Atmos cinemas
                  </p>
                </div>
                <span
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-tertiary)',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                  }}
                >
                  {filteredMovies.length} TITLES
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
                  gap: '28px',
                }}
              >
                {nowShowing.map((movie) => (
                  <MovieCard key={movie._id} movie={movie} />
                ))}
              </div>
            </div>

            {/* Section 2: Top Rated Blockbusters */}
            {topRated.length > 0 && !search && selectedGenre === 'All' && (
              <div style={{ marginBottom: '60px' }}>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiAward style={{ color: '#FCD34D' }} size={22} />
                    <h2 style={{ fontSize: '26px', fontWeight: 800, margin: 0 }}>
                      Top Rated Blockbusters
                    </h2>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '6px 0 0 0' }}>
                    Highest rated cinematic masterpieces voted by cinema viewers
                  </p>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
                    gap: '28px',
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
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiCalendar style={{ color: 'var(--accent-light)' }} size={22} />
                    <h2 style={{ fontSize: '26px', fontWeight: 800, margin: 0 }}>
                      Latest Premieres
                    </h2>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '6px 0 0 0' }}>
                    Freshly added releases ready for instant ticket reservations
                  </p>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
                    gap: '28px',
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

// Reusable Rich Movie Card Component
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
        borderRadius: '18px',
        padding: '12px',
        backgroundColor: 'rgba(21, 26, 40, 0.75)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: `1px solid ${isHovered ? 'rgba(229, 9, 20, 0.45)' : 'rgba(255, 255, 255, 0.08)'}`,
        transform: isHovered ? 'translateY(-8px)' : 'none',
        boxShadow: isHovered
          ? '0 24px 48px -10px rgba(0, 0, 0, 0.85), 0 0 24px rgba(229, 9, 20, 0.25)'
          : '0 12px 28px -8px rgba(0, 0, 0, 0.6)',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* 2:3 Poster Container */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '2 / 3',
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: '#181E30',
          marginBottom: '14px',
        }}
      >
        <img
          src={movie.posterUrl}
          alt={movie.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: isHovered ? 'scale(1.08)' : 'scale(1)',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x450/1A1A23/FFFFFF?text=No+Poster';
          }}
        />

        {/* Poster Top Badges */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            right: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              backgroundColor: 'rgba(11, 13, 20, 0.75)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#FFFFFF',
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            {movie.language || 'Cinema'}
          </span>

          {/* Rating Badge */}
          <div
            style={{
              backgroundColor: 'rgba(11, 13, 20, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 184, 0, 0.4)',
              color: '#FCD34D',
              padding: '3px 9px',
              borderRadius: '100px',
              fontSize: '12px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
            }}
          >
            <FiStar size={12} style={{ fill: '#FCD34D' }} />
            <span>{movie.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Hover Book Overlay Button */}
        {isHovered && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(11, 13, 20, 0.9) 0%, rgba(11, 13, 20, 0.4) 60%)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              padding: '16px',
              animation: 'fadeIn 0.25s ease',
            }}
          >
            <Link to={`/movies/${movie._id}`} style={{ width: '100%' }}>
              <Button
                variant="primary"
                style={{
                  width: '100%',
                  borderRadius: '10px',
                  padding: '11px',
                  fontSize: '13.5px',
                  boxShadow: '0 8px 24px rgba(229, 9, 20, 0.5)',
                }}
                icon={<FiFilm size={15} />}
              >
                Book Tickets
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Details Footer */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <h3
            style={{
              fontSize: '16px',
              fontWeight: 700,
              marginBottom: '6px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: isHovered ? 'var(--accent-light)' : '#FFFFFF',
              transition: 'color 0.2s ease',
            }}
          >
            {movie.title}
          </h3>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '10px',
              fontSize: '12.5px',
              color: 'var(--text-secondary)',
            }}
          >
            <span>{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
            <span>&bull;</span>
            <span>{new Date(movie.releaseDate).getFullYear()}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {movie.genre.slice(0, 2).map((g) => (
            <span
              key={g}
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '3px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              {g}
            </span>
          ))}
          {movie.genre.length > 2 && (
            <span
              style={{
                fontSize: '10.5px',
                color: 'var(--text-tertiary)',
                alignSelf: 'center',
              }}
            >
              +{movie.genre.length - 2}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
