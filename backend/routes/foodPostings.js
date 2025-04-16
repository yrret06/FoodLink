const express = require('express');
const router = express.Router();
const FoodPosting = require('../models/FoodPosting');

// GET /api/food-postings - fetch food postings
router.get('/', async (req, res) => {
  try {
    const postings = await FoodPosting.find()
      .populate('restaurantId', 'name') // 🧠 populate only restaurant name
      .sort({ timestamp: -1 });

    res.json(postings);
  } catch (err) {
    console.error('❌ Failed to fetch food postings:', err);
    res.status(500).json({ error: 'Failed to fetch food postings' });
  }
});
// POST /api/food-postings - create a new food posting
router.post('/', async (req, res) => {
  const { restaurantId, items, priority = 'Medium' } = req.body;

  if (!restaurantId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const validPriorities = ['High', 'Medium', 'Low'];
  if (!validPriorities.includes(priority)) {
    return res.status(400).json({ error: 'Invalid priority value' });
  }

  try {
    const newPosting = await FoodPosting.create({
      restaurantId,
      items,
      priority,
    });

    res.status(201).json(newPosting);
  } catch (err) {
    console.error('❌ Failed to save food posting:', err);
    res.status(500).json({ error: 'Failed to save food posting' });
  }
});

// PATCH /api/food-postings/:id/request - mark item as requested
router.patch('/:id/request', async (req, res) => {
  const { foodItemName, shelterId } = req.body;

  if (!foodItemName || !shelterId) {
    return res.status(400).json({ error: 'Missing foodItemName or shelterId' });
  }

  try {
    const posting = await FoodPosting.findById(req.params.id);
    if (!posting) return res.status(404).json({ error: 'Posting not found' });

    const item = posting.items.find(item => item.foodItem === foodItemName && !item.requested);
    if (!item) return res.status(404).json({ error: 'Item not available or already requested' });

    item.requested = true;
    item.requestedBy = shelterId;

    await posting.save();

    res.status(200).json(posting);
  } catch (err) {
    console.error('Error marking item as requested:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/mypickups/:shelterId', async (req, res) => {
  try {
    const postings = await FoodPosting.find({
      'items.requested': true,
      'items.requestedBy': req.params.shelterId
    }).populate('restaurantId', 'name');

    res.json(postings);
  } catch (err) {
    console.error('Failed to fetch my pickups:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
