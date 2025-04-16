const mongoose = require('mongoose');

const FoodPostingSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  items: [
    {
      foodItem: String,
      pounds: Number,
      requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shelter',
      },
      requested: { type: Boolean, default: false },
    }
  ],
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium',
  },
  timestamp: { type: Date, default: Date.now },
}, { collection: 'food_postings' });

module.exports = mongoose.model('FoodPosting', FoodPostingSchema);
