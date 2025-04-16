const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://vteja33:oVoiOP59Cs0iIOgo@food-db.fliyuls.mongodb.net/test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected ✅");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = { connectDB };