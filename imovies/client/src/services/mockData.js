// Resilient movie catalog and show generator for seamless live preview on Vercel/Netlify
export const mockMovies = [
  {
    _id: 'm1',
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
    genre: ['Sci-Fi', 'Action', 'Thriller'],
    language: 'English',
    duration: 148,
    releaseDate: '2010-07-16',
    rating: 8.8,
    posterUrl: 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
    trailerUrl: 'https://www.youtube.com/embed/YoHD9XEInc0',
    isActive: true,
  },
  {
    _id: 'm2',
    title: 'Interstellar',
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    genre: ['Sci-Fi', 'Drama', 'Adventure'],
    language: 'English',
    duration: 169,
    releaseDate: '2014-11-07',
    rating: 8.7,
    posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
    isActive: true,
  },
  {
    _id: 'm3',
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    genre: ['Action', 'Crime', 'Drama'],
    language: 'English',
    duration: 152,
    releaseDate: '2008-07-18',
    rating: 9.0,
    posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    trailerUrl: 'https://www.youtube.com/embed/EXeTwQWrcwY',
    isActive: true,
  },
  {
    _id: 'm4',
    title: 'Oppenheimer',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    genre: ['Biography', 'Drama', 'History'],
    language: 'English',
    duration: 180,
    releaseDate: '2023-07-21',
    rating: 8.9,
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    trailerUrl: 'https://www.youtube.com/embed/uYPbbksJxIg',
    isActive: true,
  },
  {
    _id: 'm5',
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family, facing a choice between love and the fate of the universe.',
    genre: ['Sci-Fi', 'Adventure', 'Action'],
    language: 'English',
    duration: 166,
    releaseDate: '2024-03-01',
    rating: 8.6,
    posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    isActive: true,
  },
  {
    _id: 'm6',
    title: 'Avatar: The Way of Water',
    description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns, Jake must work with Neytiri and the army of the Na'vi to protect their home.",
    genre: ['Sci-Fi', 'Action', 'Adventure'],
    language: 'English',
    duration: 192,
    releaseDate: '2022-12-16',
    rating: 7.6,
    posterUrl: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    trailerUrl: 'https://www.youtube.com/embed/d9MyW72ELq0',
    isActive: true,
  },
  {
    _id: 'm7',
    title: 'Spider-Man: Across the Spider-Verse',
    description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
    genre: ['Animation', 'Action', 'Adventure'],
    language: 'English',
    duration: 140,
    releaseDate: '2023-06-02',
    rating: 8.7,
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    trailerUrl: 'https://www.youtube.com/embed/cqGjhVJWtEg',
    isActive: true,
  },
  {
    _id: 'm8',
    title: 'Gladiator II',
    description: 'Years after witnessing the death of Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors.',
    genre: ['Action', 'Drama', 'Adventure'],
    language: 'English',
    duration: 148,
    releaseDate: '2024-11-22',
    rating: 7.4,
    posterUrl: 'https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
    trailerUrl: 'https://www.youtube.com/embed/4rgYUipGJNo',
    isActive: true,
  },
  {
    _id: 'm9',
    title: 'Avengers: Endgame',
    description: "After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos' actions.",
    genre: ['Action', 'Sci-Fi', 'Adventure'],
    language: 'English',
    duration: 181,
    releaseDate: '2019-04-26',
    rating: 8.4,
    posterUrl: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    trailerUrl: 'https://www.youtube.com/embed/TcMBFSGVi1c',
    isActive: true,
  },
  {
    _id: 'm10',
    title: 'Top Gun: Maverick',
    description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates.",
    genre: ['Action', 'Drama'],
    language: 'English',
    duration: 130,
    releaseDate: '2022-05-27',
    rating: 8.3,
    posterUrl: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
    trailerUrl: 'https://www.youtube.com/embed/giXco2nxYKk',
    isActive: true,
  },
  {
    _id: 'm11',
    title: 'Pahala Pyar',
    description: 'A heartwarming romantic drama exploring the sweetness and emotions of first love, dreams, and overcoming life challenges together.',
    genre: ['Romance', 'Drama'],
    language: 'Hindi',
    duration: 145,
    releaseDate: '2024-02-14',
    rating: 8.6,
    posterUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/embed/YoHD9XEInc0',
    isActive: true,
  },
];

// Generate shows for a movie and date
export const getMockShows = (movieId, dateStr) => {
  const movie = mockMovies.find((m) => m._id === movieId) || mockMovies[0];
  const theatres = [
    { name: 'PVR IMAX Grand Plaza', screen: 'IMAX Laser 1', price: 18 },
    { name: 'INOX Megaplex', screen: 'Screen 2 (Dolby Atmos)', price: 15 },
    { name: 'Cinepolis VIP Royale', screen: 'VIP Audi 4', price: 22 },
  ];
  const times = ['10:30 AM', '02:00 PM', '06:15 PM', '09:45 PM'];

  const list = [];
  theatres.forEach((th, thIdx) => {
    times.forEach((t, tIdx) => {
      list.push({
        _id: `show_${movieId}_${dateStr}_${thIdx}_${tIdx}`,
        movie: movie,
        theatreName: th.name,
        screen: th.screen,
        date: dateStr,
        time: t,
        price: th.price,
        totalSeats: 100,
        bookedSeats: ['A3', 'B4', 'C5', 'F7', 'G8'],
      });
    });
  });
  return list;
};

// Get single mock show
export const getMockShowById = (showId) => {
  // Find which movie ID is in the showId string
  const parts = showId.split('_');
  const movieId = parts[1] || 'm1';
  const movie = mockMovies.find((m) => m._id === movieId) || mockMovies[0];
  const dateStr = parts[2] || new Date().toISOString().split('T')[0];

  return {
    _id: showId,
    movie: movie,
    theatreName: 'PVR IMAX Grand Plaza',
    screen: 'IMAX Laser 1',
    date: dateStr,
    time: '06:15 PM',
    price: 18,
    totalSeats: 100,
    bookedSeats: ['A1', 'A2', 'D4', 'D5', 'G7'],
  };
};

// Create mock booking
export const createMockBooking = (showId, seats) => {
  const show = getMockShowById(showId);
  const booking = {
    _id: 'bk_' + Math.random().toString(36).substring(2, 10),
    show: show,
    seats: seats,
    totalAmount: seats.length * show.price,
    status: 'confirmed',
    bookingDate: new Date().toISOString(),
  };

  try {
    const existing = JSON.parse(localStorage.getItem('imovies_user_bookings') || '[]');
    existing.unshift(booking);
    localStorage.setItem('imovies_user_bookings', JSON.stringify(existing));
  } catch (e) {
    console.warn('Could not save booking to localStorage:', e);
  }

  return booking;
};

// Get mock bookings
export const getMockBookings = () => {
  try {
    const saved = localStorage.getItem('imovies_user_bookings');
    if (saved) return JSON.parse(saved);
  } catch {}
  return [
    {
      _id: 'bk_sample123',
      show: getMockShowById('show_m1_today_0_0'),
      seats: ['E4', 'E5'],
      totalAmount: 36,
      status: 'confirmed',
      bookingDate: new Date().toISOString(),
    },
  ];
};
