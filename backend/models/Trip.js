import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    destination: { type: String, required: true },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
      address: String,
    },

    status: {
  type: String,
  enum: ["OPEN", "CLOSED", "COMPLETED"],
  default: "OPEN",
},


    startDate: Date,
    endDate: Date,
    budget: Number,
    maxPeople: Number,
    description: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    joinedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    joinRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// 🔥 Geo index
tripSchema.index({ location: "2dsphere" });

export default mongoose.model("Trip", tripSchema);
