const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  orgId: { type: mongoose.Schema.Types.ObjectId, required: true },
  role: { type: String, enum: ['restaurant', 'shelter'], required: true },
});


module.exports = mongoose.model('User', UserSchema);
