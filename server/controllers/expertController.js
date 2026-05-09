const Expert = require('../models/Expert');
const Booking = require('../models/Booking');

// @desc    Get all experts
// @route   GET /api/experts
// @access  Public
const getExperts = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;

    const query = {};
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    if (category) {
      query.category = category;
    }

    const experts = await Expert.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Expert.countDocuments(query);

    res.json({
      experts,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalExperts: count,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get expert by ID
// @route   GET /api/experts/:id
// @access  Public
const getExpertById = async (req, res, next) => {
  try {
    const expert = await Expert.findById(req.params.id);
    
    if (!expert) {
      res.status(404);
      throw new Error('Expert not found');
    }

    // Get booked slots for this expert to filter out availability
    const bookedSlots = await Booking.find({ 
      expertId: expert._id,
      status: { $ne: 'Cancelled' } 
    }).select('date slot');

    // Attach booked slots to response so frontend knows what is disabled
    res.json({
      expert,
      bookedSlots
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExperts,
  getExpertById,
};
