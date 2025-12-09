// fixPmcidIndex.ts
import { config } from "dotenv";
import { MongoClient } from "mongodb";

config(); // Load environment variables from .env

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not set in .env");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("test"); // Replace with your database name if different
    const collection = db.collection("articles");

    // OPTIONAL: Remove documents with pmcid: null to avoid duplicates
    const deleteResult = await collection.deleteMany({ pmcid: null });
    console.log(`Removed ${deleteResult.deletedCount} documents with pmcid: null`);

    // Drop old index if exists
    try {
      await collection.dropIndex("pmcid_1");
      console.log("Dropped old pmcid index");
    } catch (err: any) {
      if (err.codeName === "IndexNotFound") {
        console.log("No old index found, skipping drop");
      } else {
        throw err;
      }
    }

    // Create new sparse unique index
    await collection.createIndex({ pmcid: 1 }, { unique: true, sparse: true });
    console.log("Created sparse unique pmcid index successfully!");
  } catch (err) {
    console.error("Error fixing pmcid index:", err);
  } finally {
    await client.close();
    process.exit(0);
  }
}

run();
