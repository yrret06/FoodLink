const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/', async (req, res) => {
  const { uid, email, orgId, role } = req.body;

  if (!uid || !email || !orgId || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newUser = await User.create({ uid, email, orgId, role });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

module.exports = router;
