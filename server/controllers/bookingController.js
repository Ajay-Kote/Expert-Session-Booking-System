const Booking = require('../models/Booking');
const Expert = require('../models/Expert');
const Joi = require('joi');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Public
const createBooking = async (req, res, next) => {
  try {
    const { expertId, userName, userEmail, userPhone, date, slot, notes } = req.body;

    // Validation
    const schema = Joi.object({
      expertId: Joi.string().required(),
      userName: Joi.string().required(),
      userEmail: Joi.string().email().required(),
      userPhone: Joi.string().required(),
      date: Joi.string().required(), // YYYY-MM-DD
      slot: Joi.string().required(), // HH:mm
      notes: Joi.string().allow('').optional(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // Verify expert exists
    const expert = await Expert.findById(expertId);
    if (!expert) {
      res.status(404);
      throw new Error('Expert not found');
    }

    // Try to create the booking (Database compound index handles race conditions/double booking)
    const booking = await Booking.create({
      expertId,
      userName,
      userEmail: userEmail.trim().toLowerCase(),
      userPhone,
      date,
      slot,
      notes,
    });

    // Emit socket event to notify all clients that a slot was booked
    const io = req.app.get('io');
    if (io) {
      io.emit('slotBooked', {
        expertId,
        date,
        slot
      });
    }

    res.status(201).json(booking);
  } catch (error) {
    next(error); // Error handler will catch 11000 duplicate key error
  }
};

// @desc    Get bookings for a user by email
// @route   GET /api/bookings
// @access  Public
const getBookings = async (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email) {
      res.status(400);
      throw new Error('Email is required to fetch bookings');
    }

    const searchEmail = email.trim();

    const bookings = await Booking.find({ 
      userEmail: { $regex: new RegExp(`^${searchEmail}$`, 'i') } 
    })
      .populate('expertId', 'name category')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
// @access  Public
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    if (!['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status');
    }

    booking.status = status;
    const updatedBooking = await booking.save();

    res.json(updatedBooking);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getBookings,
  updateBookingStatus,
};
