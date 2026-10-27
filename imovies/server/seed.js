const dotenv = require('dotenv');
dotenv.config();

const { connectDB } = require('./config/db');
const User = require('./models/User');
const Movie = require('./models/Movie');
const Show = require('./models/Show');
const Booking = require('./models/Booking');

const seedData = async (exitOnComplete = true) => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Movie.deleteMany({});
    await Show.deleteMany({});
    await Booking.deleteMany({});

    console.log('Creating users...');
    const admin = await User.create({
      name: 'Admin Cinema',
      email: 'admin@imovies.com',
      password: 'admin123',
      role: 'admin',
    });

    const user = await User.create({
      name: 'John Doe',
      email: 'user@imovies.com',
      password: 'user123',
      role: 'user',
    });

    const userMovies = await User.create({
      name: 'Demo Movie User',
      email: 'user@movies.com',
      password: 'user123',
      role: 'user',
    });

    console.log('Users created:');
    console.log(`- Admin: ${admin.email} (password: admin123)`);
    console.log(`- User: ${user.email} (password: user123)`);
    console.log(`- User (Alias): ${userMovies.email} (password: user123)`);

    console.log('Creating sample movies...');
    const sampleMovies = [
      {
        title: 'Inception',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
        genre: ['Sci-Fi', 'Action', 'Thriller'],
        language: 'English',
        duration: 148,
        releaseDate: new Date('2010-07-16'),
        rating: 8.8,
        posterUrl: 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
        trailerUrl: 'https://www.youtube.com/embed/YoHD9XEInc0',
        isActive: true,
      },
      {
        title: 'Interstellar',
        description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
        genre: ['Sci-Fi', 'Drama', 'Adventure'],
        language: 'English',
        duration: 169,
        releaseDate: new Date('2014-11-07'),
        rating: 8.7,
        posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
        isActive: true,
      },
      {
        title: 'The Dark Knight',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        genre: ['Action', 'Crime', 'Drama'],
        language: 'English',
        duration: 152,
        releaseDate: new Date('2008-07-18'),
        rating: 9.0,
        posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        trailerUrl: 'https://www.youtube.com/embed/EXeTwQWrcwY',
        isActive: true,
      },
      {
        title: 'Oppenheimer',
        description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
        genre: ['Biography', 'Drama', 'History'],
        language: 'English',
        duration: 180,
        releaseDate: new Date('2023-07-21'),
        rating: 8.9,
        posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
        trailerUrl: 'https://www.youtube.com/embed/uYPbbksJxIg',
        isActive: true,
      },
      {
        title: 'Dune: Part Two',
        description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family, facing a choice between love and the fate of the universe.',
        genre: ['Sci-Fi', 'Adventure', 'Action'],
        language: 'English',
        duration: 166,
        releaseDate: new Date('2024-03-01'),
        rating: 8.6,
        posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
        trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
        isActive: true,
      },
      {
        title: 'Avatar: The Way of Water',
        description: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi race to protect their home.',
        genre: ['Sci-Fi', 'Action', 'Adventure'],
        language: 'English',
        duration: 192,
        releaseDate: new Date('2022-12-16'),
        rating: 7.6,
        posterUrl: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
        trailerUrl: 'https://www.youtube.com/embed/d9MyW72ELq0',
        isActive: true,
      },
      {
        title: 'Spider-Man: Across the Spider-Verse',
        description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.',
        genre: ['Animation', 'Action', 'Adventure'],
        language: 'English',
        duration: 140,
        releaseDate: new Date('2023-06-02'),
        rating: 8.7,
        posterUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
        trailerUrl: 'https://www.youtube.com/embed/cqGjhVJWtEg',
        isActive: true,
      },
      {
        title: 'Gladiator II',
        description: 'Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist.',
        genre: ['Action', 'Drama', 'Adventure'],
        language: 'English',
        duration: 148,
        releaseDate: new Date('2024-11-22'),
        rating: 7.4,
        posterUrl: 'https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
        trailerUrl: 'https://www.youtube.com/embed/4rgYUipGJNo',
        isActive: true,
      },
      {
        title: 'Avengers: Endgame',
        description: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos\' actions and restore balance to the universe.',
        genre: ['Action', 'Sci-Fi', 'Adventure'],
        language: 'English',
        duration: 181,
        releaseDate: new Date('2019-04-26'),
        rating: 8.4,
        posterUrl: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
        trailerUrl: 'https://www.youtube.com/embed/TcMBFSGVi1c',
        isActive: true,
      },
      {
        title: 'Top Gun: Maverick',
        description: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN\'s elite graduates on a mission that demands the ultimate sacrifice from those chosen to fly it.',
        genre: ['Action', 'Drama'],
        language: 'English',
        duration: 130,
        releaseDate: new Date('2022-05-27'),
        rating: 8.3,
        posterUrl: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
        trailerUrl: 'https://www.youtube.com/embed/giXco2nxYKk',
        isActive: true,
      },
    ];

    const createdMovies = await Movie.insertMany(sampleMovies);
    console.log(`Created ${createdMovies.length} movies.`);

    console.log('Generating shows for the next 7 days...');
    const theatres = [
      { name: 'PVR IMAX Grand Plaza', screen: 'IMAX Laser 1', price: 18 },
      { name: 'INOX Megaplex', screen: 'Screen 2 (Dolby Atmos)', price: 15 },
      { name: 'Cinepolis VIP Royale', screen: 'VIP Audi 4', price: 22 },
      { name: 'Star Cinema 4K', screen: 'Screen 3', price: 12 },
    ];

    const showTimes = ['10:30 AM', '02:00 PM', '06:15 PM', '09:45 PM'];

    const showsToInsert = [];

    const formatDate = (date) => {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    const now = new Date();

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const showDate = new Date(now);
      showDate.setDate(now.getDate() + dayOffset);
      const dateString = formatDate(showDate);

      for (const movie of createdMovies) {
        const numShows = dayOffset % 2 === 0 ? 4 : 3;

        for (let s = 0; s < numShows; s++) {
          const theatre = theatres[s % theatres.length];
          const time = showTimes[s % showTimes.length];

          let sampleBooked = [];
          if (s === 0) {
            sampleBooked = ['A1', 'A2', 'C4', 'C5', 'F8'];
          } else if (s === 1) {
            sampleBooked = ['B5', 'B6', 'D7', 'E1', 'E2', 'J9', 'J10'];
          } else if (s === 2) {
            sampleBooked = ['C1', 'C2', 'G4', 'G5', 'H6'];
          }

          showsToInsert.push({
            movie: movie._id,
            theatreName: theatre.name,
            screen: theatre.screen,
            date: dateString,
            time: time,
            price: theatre.price,
            totalSeats: 100,
            bookedSeats: sampleBooked,
          });
        }
      }
    }

    const createdShows = await Show.insertMany(showsToInsert);
    console.log(`Created ${createdShows.length} shows across 7 days.`);

    const sampleShow = createdShows[0];
    const userBooking = await Booking.create({
      user: user._id,
      show: sampleShow._id,
      seats: ['A1', 'A2'],
      totalAmount: sampleShow.price * 2,
      status: 'confirmed',
      bookingDate: new Date(),
    });
    console.log(`Created 1 sample confirmed booking for ${user.email} (Booking ID: ${userBooking._id})`);

    console.log('--- DATABASE SEEDING COMPLETED SUCCESSFULLY ---');
    if (exitOnComplete) {
      process.exit(0);
    }
  } catch (error) {
    console.error('Error seeding database:', error);
    if (exitOnComplete) {
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  seedData(true);
}

module.exports = { seedData };
