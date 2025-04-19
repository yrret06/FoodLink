// backend/importCSV.js
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { connectDB } = require("./db");
const Restaurant = require("./models/Restaurants");

connectDB();

const filePath = path.join(__dirname, "data", "open_restaurants.csv");

const restaurants = [];

async function insertInBatches(data, batchSize = 1000) {
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    try {
      await Restaurant.insertMany(batch, { ordered: false });
      console.log(`✅ Inserted ${i + batch.length} of ${data.length}`);
    } catch (err) {
      console.error(`❌ Error inserting batch starting at index ${i}:`, err.message);
    }
  }
}

fs.createReadStream(filePath)
  .pipe(csv())
  .on("data", (row) => {
  const restaurant = {
  name: row.RestaurantName?.trim(),
  type: "restaurant",
  borough: row.Borough?.trim(),
  address: row.BusinessAddress?.trim(),
  postcode: row.Postcode?.trim(),
  latitude: parseFloat(row.Latitude),
  longitude: parseFloat(row.Longitude),
};

  if (restaurant.name && restaurant.address && restaurant.postcode) {
    restaurants.push(restaurant);
  }
})
.on("end", async () => {
  console.log(`📦 Parsed ${restaurants.length} restaurants.`);

  try {
    await insertInBatches(restaurants);
    console.log("✅ All restaurant data imported successfully.");
  } catch (err) {
    console.error("❌ Final import error:", err.message);
  } finally {
    process.exit(0);
  }
});
