import axios from 'axios';
import {
  mockMovies,
  getMockShows,
  getMockShowById,
  createMockBooking,
  getMockBookings,
} from './mockData';

let rawBaseUrl = (import.meta.env.VITE_API_URL || '').trim();

if (!rawBaseUrl) {
  if (
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    // When deployed live on Vercel/Netlify without explicit backend URL, use relative /api
    rawBaseUrl = '/api';
  } else {
    rawBaseUrl = 'http://localhost:5000/api';
  }
}

rawBaseUrl = rawBaseUrl.replace(/\/+$/, '');
if (!rawBaseUrl.endsWith('/api')) {
  rawBaseUrl += '/api';
}

const API = axios.create({
  baseURL: rawBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 6000,
});

// Request interceptor to attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with smart live-preview fallback
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const isNetworkError = !error.response || error.code === 'ERR_NETWORK' || error.response?.status === 404 || error.response?.status >= 500;
    const url = error.config?.url || '';
    const method = (error.config?.method || 'get').toLowerCase();

    // Fallback for live Vercel deployments when backend is offline
    if (isNetworkError) {
      console.warn(`[API Fallback] Backend offline for ${method.toUpperCase()} ${url}. Using live preview fallback.`);

      // 1. GET /movies
      if (url.includes('/movies') && method === 'get' && !url.match(/\/movies\/[a-zA-Z0-9_-]+/)) {
        return Promise.resolve({
          data: {
            success: true,
            count: mockMovies.length,
            data: mockMovies,
          },
        });
      }

      // 2. GET /movies/:id
      const movieMatch = url.match(/\/movies\/([a-zA-Z0-9_-]+)/);
      if (movieMatch && method === 'get') {
        const id = movieMatch[1];
        const found = mockMovies.find((m) => m._id === id) || mockMovies[0];
        return Promise.resolve({
          data: {
            success: true,
            data: found,
          },
        });
      }

      // 3. GET /shows/movie/:id
      const showsMovieMatch = url.match(/\/shows\/movie\/([a-zA-Z0-9_-]+)/);
      if (showsMovieMatch && method === 'get') {
        const id = showsMovieMatch[1];
        const params = error.config?.params || {};
        const dateStr = params.date || new Date().toISOString().split('T')[0];
        return Promise.resolve({
          data: {
            success: true,
            data: getMockShows(id, dateStr),
          },
        });
      }

      // 4. GET /shows/:id
      const showMatch = url.match(/\/shows\/([a-zA-Z0-9_-]+)/);
      if (showMatch && method === 'get') {
        const id = showMatch[1];
        return Promise.resolve({
          data: {
            success: true,
            data: getMockShowById(id),
          },
        });
      }

      // 5. POST /bookings
      if (url.includes('/bookings') && method === 'post') {
        try {
          const body = typeof error.config?.data === 'string' ? JSON.parse(error.config.data) : error.config?.data || {};
          const booking = createMockBooking(body.showId || 'show_m1_today_0_0', body.seats || ['A1']);
          return Promise.resolve({
            data: {
              success: true,
              booking,
              data: booking,
            },
          });
        } catch (e) {
          console.error('Error generating fallback booking:', e);
        }
      }

      // 6. GET /bookings/my
      if (url.includes('/bookings/my') && method === 'get') {
        return Promise.resolve({
          data: {
            success: true,
            data: getMockBookings(),
          },
        });
      }
    }

    return Promise.reject(error);
  }
);

export default API;
