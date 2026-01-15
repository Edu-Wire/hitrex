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

    // 🔥 NEW SECTIONS
    activities: {
      type: [String],
      default: [],
    },

    included: {
      type: [String],
      default: [],
    },

    excluded: {
      type: [String],
      default: [],
    },
    gallery: {
      type: [String],
      default: [],
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

// Force schema update in development
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.Destination;
}

const Destination = mongoose.models.Destination || mongoose.model("Destination", DestinationSchema);
export default Destination;
