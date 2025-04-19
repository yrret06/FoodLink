// backend/routes/shelters.js
const express = require('express');
const router = express.Router();
const Shelter = require('../models/Shelters');

// GET /api/shelters
router.get('/', async (req, res) => {
  try {
    const count = await Shelter.countDocuments();
    console.log('🏠 Shelter count:', count);

    const shelters = await Shelter.find().limit(50);
    console.log('🏠 First shelter:', shelters[0]);

    res.json(shelters);
  } catch (err) {
    console.error('❌ Error fetching shelters:', err);
    res.status(500).json({ error: 'Failed to fetch shelters' });
  }
});

module.exports = router;
