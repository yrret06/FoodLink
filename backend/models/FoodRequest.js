const mongoose = require('mongoose');

const FoodRequestSchema = new mongoose.Schema({
  shelterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shelter', required: true },
  food: {
    item: { type: String, required: true },
    pounds: { type: Number, required: true },
  },
  poundsFulfilled: { type: Number, default: 0 },  // ✅ Add this
  fulfilled: { type: Boolean, default: false },   // ✅ And this
  timestamp: { type: Date, default: Date.now }
}, { collection: 'food_requests' });

module.exports = mongoose.model('FoodRequest', FoodRequestSchema);
