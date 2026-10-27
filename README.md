# 🎬 IMovies - Online Movie Ticket Booking Platform

**IMovies** is a full-stack MERN (MongoDB, Express, React, Node.js) web application designed for reserving cinema tickets with real-time seat tracking and atomic double-booking prevention.

---

## 🌟 Key Features

- **Dark Cinematic UI**: Sleek dark aesthetic (`#0a0b10`) with vibrant red accents (`#e50914`), glassmorphism overlays, and full mobile responsiveness.
- **Atomic Concurrency Control**: Uses atomic MongoDB updates (`$nin` + `$push`) to eliminate race conditions and double bookings when multiple users reserve seats simultaneously.
- **Real-Time Seat Availability**: Polls the seating plan every 10 seconds to reflect real-time bookings from other cinema goers.
- **Interactive Seat Selection Grid**: 100-seat theatrical layout (Rows A to J, 10 seats per row) with curved screen indicator, legend, and live seat state transitions.
- **7-Day Dynamic Date Selector**: Horizontal scrollable date pills showing showtimes grouped by theatre with screen details and ticket prices.
- **Official Trailer Modal**: Responsive YouTube trailer player for instant movie previews.
- **Booking Management**: View Upcoming and Past bookings, download/view digital cinema ticket passes, and cancel reservations to immediately release seats.
- **Admin Management Console**: Dedicated portal to manage movies, create/edit/delete showtimes, and view all system-wide bookings.
- **Embedded MongoDB Auto-Fallback**: Out-of-the-box support for local MongoDB service with zero-configuration fallback via `mongodb-memory-server`.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Bootstrap 5, React Router v6, Axios, Bootstrap Icons
- **Backend**: Node.js, Express.js, MongoDB with Mongoose ODM
- **Security & Performance**: JWT (7-day validity), bcryptjs, Helmet, Express-Rate-Limit, CORS
- **Architecture**: Clean MVC folder structure on backend, Context API & modular components on frontend

---

## 📋 Prerequisites

- **Node.js**: v16.0.0 or higher (v18+ recommended)
- **npm**: v8.0.0 or higher
- **MongoDB**: Standalone MongoDB on `mongodb://127.0.0.1:27017` OR use the built-in embedded database engine.

---

## 📂 Project Structure

```text
imovies/
├── client/                      # Frontend Vite + React application
│   ├── public/
│   ├── src/
│   │   ├── components/          # Navbar, Footer, ProtectedRoute, AdminRoute
│   │   ├── context/             # AuthContext, ToastContext
│   │   ├── pages/               # Home, MovieDetails, SeatSelection, MyBookings, AdminDashboard, Login, Register
│   │   ├── services/            # Axios instance with JWT interceptor
│   │   ├── App.jsx              # Main routing configuration
│   │   ├── index.css            # Custom cinematic stylesheet
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── server/                      # Backend Node.js + Express REST API
    ├── config/                  # MongoDB connection & fallback
    ├── controllers/             # authController, movieController, showController, bookingController
    ├── middleware/              # auth (protect, admin), error handling
    ├── models/                  # User, Movie, Show, Booking schemas
    ├── routes/                  # authRoutes, movieRoutes, showRoutes, bookingRoutes
    ├── .env                     # Server environment variables
    ├── package.json
    ├── seed.js                  # Database seed script
    ├── server.js                # Express app entrypoint
    └── testFlow.js              # End-to-end integration test suite
```

---

## ⚙️ Environment Variables

The server configuration resides in `imovies/server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/imovies
JWT_SECRET=imovies_secret_key
```

---

## 🚀 Setup & Installation Steps

### 1. Install Backend Dependencies
```bash
cd imovies/server
npm install
```

### 2. Install Frontend Dependencies
```bash
cd ../client
npm install
```

### 3. Seed the Database
Populates 1 admin user, 1 standard user, 10 sample movies, and 250+ shows across the next 7 days:
```bash
cd ../server
npm run seed
```

---

## 🏃 Running the Application

### Start the Backend Server (Port 5000)
```bash
cd imovies/server
npm run dev
# Server runs on: http://localhost:5000
```

### Start the Frontend Client (Port 5173)
```bash
cd imovies/client
npm run dev
# App accessible at: http://localhost:5173
```

---

## 🧪 Running Integration Tests

To execute the automated 18-step end-to-end test suite (testing auth, movies, shows, seat bookings, double-booking prevention, concurrency races, and cancellations):

```bash
cd imovies/server
node testFlow.js
```

---

## 🔐 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@imovies.com` | `admin123` |
| **Standard User** | `user@imovies.com` | `user123` |

*(Quick-fill buttons for both accounts are also provided on the Login page).*

---

## 📡 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Login and receive JWT (valid 7 days) | Public |
| `GET` | `/api/auth/me` | Fetch logged-in user profile | Protected |

### 🎬 Movies (`/api/movies`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/movies` | Get movies (filters: `search`, `genre`, `language`) | Public |
| `GET` | `/api/movies/:id` | Get movie details by ID | Public |
| `POST` | `/api/movies` | Add new movie | Admin |
| `PUT` | `/api/movies/:id` | Update movie details | Admin |
| `DELETE` | `/api/movies/:id` | Remove movie | Admin |

### 🕒 Shows (`/api/shows`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/shows` | Get all shows (optional filters: `movie`, `date`) | Public |
| `GET` | `/api/shows/movie/:movieId` | Get shows for movie (filtered by `?date=YYYY-MM-DD`) | Public |
| `GET` | `/api/shows/:id` | Get show details with seat layout | Public |
| `POST` | `/api/shows` | Create a new showtime | Admin |
| `PUT` | `/api/shows/:id` | Update showtime | Admin |
| `DELETE` | `/api/shows/:id` | Delete showtime | Admin |

### 🎟️ Bookings (`/api/bookings`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/bookings` | Atomic seat reservation and booking creation | Protected |
| `GET` | `/api/bookings/my` | User's personal booking history | Protected |
| `PUT` | `/api/bookings/:id/cancel` | Cancel booking and release seats | Protected (Owner/Admin) |
| `GET` | `/api/bookings` | Retrieve all bookings system-wide | Admin |
