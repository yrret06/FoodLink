const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true }, // Firebase UID
  email: { type: String, required: true },
  role: { type: String, enum: ['restaurant', 'shelter'], required: true },
  orgId: { type: mongoose.Schema.Types.ObjectId, refPath: 'role', required: true }, // dynamic ref
});

module.exports = mongoose.model("User", UserSchema);
