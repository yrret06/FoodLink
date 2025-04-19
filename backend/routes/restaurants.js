// backend/routes/restaurants.js
const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurants');

// GET /api/restaurants
router.get('/', async (req, res) => {
  try {
    const count = await Restaurant.countDocuments();
    console.log('🍽️ Restaurant count:', count);

    const restaurants = await Restaurant.find().limit(50);
    console.log('🍽️ First restaurant:', restaurants[0]);

    res.json(restaurants);
  } catch (err) {
    console.error('❌ Error fetching restaurants:', err);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

module.exports = router;
