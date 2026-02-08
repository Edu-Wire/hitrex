import mongoose from "mongoose";

const upcomingTripSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    pickupPoints: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.UpcomingTrip || mongoose.model("UpcomingTrip", upcomingTripSchema);
