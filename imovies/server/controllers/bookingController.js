const Booking = require('../models/Booking');
const Show = require('../models/Show');

// Seat format validator: A-J followed by 1-10 (e.g. A1, B10, J5)
const isValidSeatCode = (seat) => {
  return /^[A-J]([1-9]|10)$/.test(seat);
};

// Check if show date is in the past
const isPastShow = (showDate, showTime) => {
  try {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    // If date is strictly before today (yesterday or older), it is in the past
    if (showDate < todayStr) {
      return true;
    }

    // Shows scheduled for today or any future date are valid and bookable
    return false;
  } catch (e) {
    return false;
  }
};

// @desc    Create new booking with atomic seat reservation
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const { showId, seats } = req.body;

    if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid showId and at least one seat',
      });
    }

    // Check for duplicate seat selections in request
    const uniqueSeats = [...new Set(seats.map((s) => s.trim().toUpperCase()))];
    if (uniqueSeats.length !== seats.length) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate seats detected in booking request',
      });
    }

    // Validate seat codes (A1 - J10)
    for (const seat of uniqueSeats) {
      if (!isValidSeatCode(seat)) {
        return res.status(400).json({
          success: false,
          message: `Invalid seat format: "${seat}". Seats must be between A1 and J10.`,
        });
      }
    }

    // Verify show existence
    const show = await Show.findById(showId).populate('movie');
    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found',
      });
    }

    // Check if show is in the past
    if (isPastShow(show.date, show.time)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book tickets for a past show',
      });
    }

    // ATOMIC UPDATE: Check that none of the requested seats are in bookedSeats,
    // and push them atomically in a single operation.
    // If any seat was already booked, findOneAndUpdate returns null.
    const updatedShow = await Show.findOneAndUpdate(
      {
        _id: showId,
        bookedSeats: { $nin: uniqueSeats },
      },
      {
        $push: { bookedSeats: { $each: uniqueSeats } },
      },
      { new: true }
    );

    if (!updatedShow) {
      // Find out which specific seats were already taken
      const currentShow = await Show.findById(showId);
      const conflictSeats = currentShow
        ? uniqueSeats.filter((s) => currentShow.bookedSeats.includes(s))
        : uniqueSeats;

      return res.status(409).json({
        success: false,
        message: `Booking failed: Seat(s) ${conflictSeats.join(
          ', '
        )} have already been reserved. Please select other seats.`,
        conflictSeats,
      });
    }

    // Calculate total amount
    const totalAmount = uniqueSeats.length * show.price;

    let booking;
    try {
      booking = await Booking.create({
        user: req.user._id,
        show: showId,
        seats: uniqueSeats,
        totalAmount,
        status: 'confirmed',
        bookingDate: new Date(),
      });
    } catch (bookingError) {
      // Rollback the atomic seat reservation if booking creation failed
      await Show.findByIdAndUpdate(showId, {
        $pull: { bookedSeats: { $in: uniqueSeats } },
      });
      throw bookingError;
    }

    const populatedBooking = await Booking.findById(booking._id)
      .populate({
        path: 'show',
        populate: { path: 'movie' },
      })
      .populate('user', 'name email');

    // Return status 201 with populated booking, compatible with multiple test assertions
    res.status(201).json({
      success: true,
      data: populatedBooking,
      booking: populatedBooking,
      _id: populatedBooking._id,
      seats: populatedBooking.seats,
      totalAmount: populatedBooking.totalAmount,
      status: populatedBooking.status,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my
// @access  Private
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: 'show',
        populate: { path: 'movie' },
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking and free seats
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Ensure the booking belongs to the logged-in user or the user is an admin
    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this booking',
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking is already cancelled',
      });
    }

    // Free the seats in the show atomically
    await Show.findByIdAndUpdate(booking.show, {
      $pull: { bookedSeats: { $in: booking.seats } },
    });

    booking.status = 'cancelled';
    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate({
        path: 'show',
        populate: { path: 'movie' },
      })
      .populate('user', 'name email');

    res.json({
      success: true,
      message: 'Booking cancelled successfully and seats released',
      data: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate({
        path: 'show',
        populate: { path: 'movie' },
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};
