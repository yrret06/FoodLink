const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// GET /api/users/profile
router.get('/profile', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      id: user._id,
      email: user.email,
      role: user.role,
      orgId: user.orgId,
    });
  } catch (err) {
    console.error('JWT verification failed:', err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// POST /api/users
router.post('/', async (req, res) => {
  const { email, orgId, role } = req.body;

  if (!email || !orgId || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!mongoose.Types.ObjectId.isValid(orgId)) {
    return res.status(400).json({ error: 'Invalid orgId format' });
  }

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { email, orgId, role },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(201).json(user);
  } catch (err) {
    console.error('Failed to create or update user:', err);
    res.status(500).json({ error: 'Failed to create or update user' });
  }
});

module.exports = router;
