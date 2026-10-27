const mongoose = require('mongoose');

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Please provide the movie ID'],
    },
    theatreName: {
      type: String,
      required: [true, 'Please provide the theatre name'],
      trim: true,
    },
    screen: {
      type: String,
      required: [true, 'Please provide the screen number or name'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Please provide the show date (YYYY-MM-DD)'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date format must be YYYY-MM-DD'],
    },
    time: {
      type: String,
      required: [true, 'Please provide the show time (e.g., 07:00 PM)'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide the ticket price'],
      min: [0, 'Price must be greater than or equal to 0'],
    },
    totalSeats: {
      type: Number,
      default: 100,
      min: [1, 'Total seats must be at least 1'],
    },
    bookedSeats: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for querying shows by movie and date
showSchema.index({ movie: 1, date: 1 });

module.exports = mongoose.model('Show', showSchema);
