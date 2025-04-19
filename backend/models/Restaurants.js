// models/Organization.js (rename this later if you want)
const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['restaurant', 'shelter'], required: true },
  borough: String,
  address: String,
  postcode: String,
  latitude: Number,
  longitude: Number,
}, { collection: 'restaurants' }); // 👈 Force it to use "restaurants" collection

module.exports = mongoose.model("Restaurant", RestaurantSchema);

