const mongoose = require("mongoose");

const ShelterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['soup kitchen', 'food-pantry'], required: true },
  phone: String,
  address: String,
  borough: String,
  zipcode: String,
  days: String,
  hours: String,
}, { collection: 'shelters' });

module.exports = mongoose.model("Shelter", ShelterSchema);