const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  yearsOfExperience: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/150',
  },
  about: {
    type: String,
  },
  // Simple structure for slots to seed some availability
  availableSlots: [
    {
      date: { type: String, required: true }, // Format YYYY-MM-DD
      slots: [{ type: String, required: true }] // Format HH:mm
    }
  ]
}, {
  timestamps: true,
});

module.exports = mongoose.model('Expert', expertSchema);
