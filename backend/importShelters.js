const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { connectDB } = require("./db");
const Shelter = require("./models/Shelters");

connectDB();

const filePath = path.join(__dirname, "data", "shelters.csv");
const shelters = [];


async function insertInBatches(data, batchSize = 1000) {
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    try {
      await Shelter.insertMany(batch, { ordered: false });
      console.log(`✅ Inserted ${i + batch.length} of ${data.length}`);
    } catch (err) {
      console.error(`❌ Error inserting batch at index ${i}:`, err.message);
    }
  }
}

fs.createReadStream(filePath)
  .pipe(csv())
  .on("data", (row) => {
    const shelter = {
      name: row.PROGRAM?.trim(),
      type: 'shelter',
      phone: row["ORG PHONE"]?.trim(),
      address: row.DISTADD?.trim(),
      borough: row.STBO?.trim(),
      zipcode: row.DISTZIP?.trim(),
    };

    if (shelter.name && shelter.address) {
      shelters.push(shelter);
    }
  })
  .on("end", async () => {
    console.log(`📦 Parsed ${shelters.length} shelters.`);

    try {
      await insertInBatches(shelters);
      console.log("✅ All shelter data imported successfully.");
    } catch (err) {
      console.error("❌ Final import error:", err.message);
    } finally {
      process.exit(0);
    }
  });
