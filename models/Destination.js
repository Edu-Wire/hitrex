import mongoose from "mongoose";

const DestinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a destination name"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Please provide a location"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Please provide an image URL"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    date: {
      type: String,
      required: [true, "Please provide a date"],
    },
    tags: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
      default: "",
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Moderate", "Challenging", "Difficult"],
      default: "Moderate",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Destination || mongoose.model("Destination", DestinationSchema);
