const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const Shelter = require('../models/Shelter');

router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find({}, 'name type'); // select name/type only
    const shelters = await Shelter.find({}, 'name type');
    const all = [...restaurants, ...shelters];
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch organizations' });
  }
});

module.exports = router;
