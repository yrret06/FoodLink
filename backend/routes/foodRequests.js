const express = require('express');
const router = express.Router();
const FoodRequest = require('../models/FoodRequest');

// GET /api/food-requests - fetch requests made by shelters
router.get('/', async (req, res) => {
  try {
    const requests = await FoodRequest.find()
      .populate('shelterId', 'name') // 🧠 populate only shelter name
      .sort({ timestamp: -1 });

    res.json(requests);
  } catch (err) {
    console.error('Failed to fetch food requests:', err);
    res.status(500).json({ error: 'Failed to fetch food requests' });
  }
});

// POST /api/food-requests
router.post('/', async (req, res) => {
  const { shelterId, food } = req.body;

  if (!shelterId || !food || !food.item || !food.pounds) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newRequest = await FoodRequest.create({
  shelterId,
  food,
  poundsFulfilled: 0, // ✅ optional but safe
  fulfilled: false,
  timestamp: new Date(),
});

    res.status(201).json(newRequest);
  } catch (err) {
    console.error('Error saving food request:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/food-requests/:id/fulfill - fulfill part or all of a request
router.patch('/:id/fulfill', async (req, res) => {
  const { poundsFulfilled } = req.body;

  if (!poundsFulfilled || poundsFulfilled <= 0) {
    return res.status(400).json({ error: 'Fulfilled pounds must be greater than 0' });
  }

  try {
    const request = await FoodRequest.findById(req.params.id);

    if (!request) return res.status(404).json({ error: 'Request not found' });

    const remaining = request.food.pounds - request.poundsFulfilled;
    if (poundsFulfilled > remaining) {
      return res.status(400).json({ error: 'Cannot fulfill more than requested' });
    }

    request.poundsFulfilled += poundsFulfilled;
    request.fulfilled = request.poundsFulfilled >= request.food.pounds;

    await request.save();

    const updatedRequest = await FoodRequest.findById(req.params.id)
  .populate('shelterId', 'name'); // ✅ repopulate name

    res.status(200).json(updatedRequest);

  } catch (err) {
    console.error('Error fulfilling request:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
