const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expert',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userPhone: {
    type: String,
    required: true,
  },
  date: {
    type: String, // Format YYYY-MM-DD
    required: true,
  },
  slot: {
    type: String, // Format HH:mm
    required: true,
  },
  notes: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Confirmed',
  }
}, {
  timestamps: true,
});

// CRITICAL: Compound unique index to prevent double booking
// The combination of expertId, date, and slot must be unique.
bookingSchema.index({ expertId: 1, date: 1, slot: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
