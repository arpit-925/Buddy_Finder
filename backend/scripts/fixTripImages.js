/* One-time data cleanup for corrupted trip images.
   - Trips whose image is one of the known identical/incorrect uploads get
     a destination-appropriate image.
   - Trips with no image at all get a destination-appropriate image when one
     is available for their destination.
   Run: node backend/scripts/fixTripImages.js
*/
import mongoose from "mongoose";
import dotenv from "dotenv";
import { suggestedPlaces } from "../../frontend/src/data/suggestedPlaces.js";

dotenv.config();

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80";

const EXTRA = {
  kashmir: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800",
};

const MAP = suggestedPlaces.reduce((acc, p) => {
  acc[p.name.toLowerCase()] = p.image;
  return acc;
}, { ...EXTRA });

const imageFor = (destination = "") => {
  const key = destination.trim().toLowerCase();
  if (MAP[key]) return MAP[key];
  const partial = Object.keys(MAP).find(
    (c) => key.includes(c) || c.includes(key)
  );
  return partial ? MAP[partial] : DEFAULT_IMAGE;
};

const KNOWN_BAD = new Set([
  "https://res.cloudinary.com/dsbhhogzi/image/upload/v1766669830/xeiloazpmqwzbmpsmr6g.jpg",
  "https://res.cloudinary.com/dsbhhogzi/image/upload/v1766669833/lf4ntgh2yrf4atpz5tk3.jpg",
  "https://res.cloudinary.com/dsbhhogzi/image/upload/v1766669834/chzufbf8k83jncbz3eis.jpg",
  "https://res.cloudinary.com/dsbhhogzi/image/upload/v1766669834/pxtg6hkfamllkjtego0c.jpg",
  "https://res.cloudinary.com/dsbhhogzi/image/upload/v1766669838/zanl8yxge2pjdhgiztos.jpg",
]);

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 20000 });
  const trips = await mongoose.connection.db.collection("trips").find({}).toArray();

  let badCount = 0;
  let emptyCount = 0;

  for (const trip of trips) {
    if (KNOWN_BAD.has(trip.image)) {
      await mongoose.connection.db
        .collection("trips")
        .updateOne({ _id: trip._id }, { $set: { image: imageFor(trip.destination) } });
      console.log(`FIXED identical-image trip: ${trip.destination} (${trip._id})`);
      badCount++;
      continue;
    }
    if (!trip.image && trip.destination) {
      await mongoose.connection.db
        .collection("trips")
        .updateOne({ _id: trip._id }, { $set: { image: imageFor(trip.destination) } });
      console.log(`BACKFILLED empty-image trip: ${trip.destination} (${trip._id})`);
      emptyCount++;
    }
  }

  console.log(`\nDone. Fixed ${badCount} identical-image trips, backfilled ${emptyCount} empty-image trips.`);
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});