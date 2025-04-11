const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://champmuzzu:Xuw23IuBkv9sOChF@cluster0.jjtwi33.mongodb.net/foodwate", {
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