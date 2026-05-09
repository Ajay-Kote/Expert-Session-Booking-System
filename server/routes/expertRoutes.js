const express = require('express');
const router = express.Router();
const { getExperts, getExpertById } = require('../controllers/expertController');

router.route('/').get(getExperts);
router.route('/:id').get(getExpertById);

module.exports = router;
