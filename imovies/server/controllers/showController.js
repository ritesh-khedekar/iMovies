const Show = require('../models/Show');
const Movie = require('../models/Movie');

// @desc    Get all shows (optional filters by movie, date)
// @route   GET /api/shows
// @access  Public
exports.getShows = async (req, res, next) => {
  try {
    const { movie, date } = req.query;
    const query = {};

    if (movie) query.movie = movie;
    if (date) query.date = date;

    const shows = await Show.find(query)
      .populate('movie', 'title posterUrl duration language')
      .sort({ date: 1, time: 1 });

    res.json({
      success: true,
      count: shows.length,
      data: shows,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get shows for a specific movie (filtered by date)
// @route   GET /api/shows/movie/:movieId
// @access  Public
exports.getShowsByMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const { date } = req.query;

    const query = { movie: movieId };
    if (date) {
      query.date = date;
    }

    const shows = await Show.find(query)
      .populate('movie', 'title posterUrl duration language rating')
      .sort({ date: 1, time: 1 });

    res.json({
      success: true,
      count: shows.length,
      data: shows,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single show by ID
// @route   GET /api/shows/:id
// @access  Public
exports.getShowById = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id).populate('movie');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found',
      });
    }

    res.json({
      success: true,
      data: show,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new show
// @route   POST /api/shows
// @access  Private/Admin
exports.createShow = async (req, res, next) => {
  try {
    const { movie, theatreName, screen, date, time, price, totalSeats } = req.body;

    const movieExists = await Movie.findById(movie);
    if (!movieExists) {
      return res.status(400).json({
        success: false,
        message: 'Invalid movie specified',
      });
    }

    const show = await Show.create({
      movie,
      theatreName,
      screen,
      date,
      time,
      price,
      totalSeats: totalSeats || 100,
      bookedSeats: [],
    });

    const populatedShow = await Show.findById(show._id).populate('movie');

    res.status(201).json({
      success: true,
      data: populatedShow,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update show
// @route   PUT /api/shows/:id
// @access  Private/Admin
exports.updateShow = async (req, res, next) => {
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('movie');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found',
      });
    }

    res.json({
      success: true,
      data: show,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete show
// @route   DELETE /api/shows/:id
// @access  Private/Admin
exports.deleteShow = async (req, res, next) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found',
      });
    }

    res.json({
      success: true,
      message: 'Show deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
