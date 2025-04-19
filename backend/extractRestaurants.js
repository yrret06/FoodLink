// extractRestaurants.js
const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");
const { connectDB } = require("./db");
const Organization = require("./models/Organization");

// Connect to MongoDB
connectDB();

// Full path to PDF
const pdfPath = path.join(__dirname, "data", "rest.pdf");

// Example parser (adjust based on your data format)
function parseEntries(text) {
  const entries = [];
  const lines = text.split("\n");

  lines.forEach((line) => {
    const regex = /(\d+)(FP|SK)?([A-Z\s&()]+)?\(?([\d-]+)?\)?([\d\sA-Z\-,]+)?BK(\d+)([A-Z0-9:\/\(\)\s-]+)/i;
    const match = line.match(regex);

    if (match) {
      entries.push({
        name: (match[3] || "").trim(),
        phone: (match[4] || "").trim(),
        address: (match[5] || "").trim(),
        borough: "Brooklyn", // Assuming all BK
        zip: match[6] || "",
        time: (match[7] || "").trim(),
      });
    }
  });

  return entries;
}

// Read and parse PDF
fs.readFile(pdfPath, async (err, dataBuffer) => {
  if (err) {
    console.error("❌ Error reading PDF:", err);
    return;
  }

  try {
    const data = await pdf(dataBuffer);
    const entries = parseEntries(data.text);

    console.log(`Found ${entries.length} entries. Saving...`);

    for (const org of entries) {
      try {
        await Organization.create(org);
        console.log(`✅ Saved: ${org.name}`);
      } catch (err) {
        console.error(`❌ Error saving ${org.name}:`, err.message);
      }
    }

    console.log("✅ All done.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error parsing PDF:", err.message);
    process.exit(1);
  }
});
