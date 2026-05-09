const express = require('express');
const router = express.Router();
const { createBooking, getBookings } = require('../controllers/bookingController');

router.route('/').post(createBooking).get(getBookings);

module.exports = router;
