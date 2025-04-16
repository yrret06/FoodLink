// backend/routes/foodItems.js
const express = require('express');
const router = express.Router();
const foodItems = require('../data/foodItems');

router.get('/', (req, res) => {
  res.json(foodItems);
});

module.exports = router;
