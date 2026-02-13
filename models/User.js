import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide a first name"],
      trim: true,
    },
    surname: {
      type: String,
      required: [true, "Please provide a surname"],
      trim: true,
    },
    gender: {
      type: String,
      required: [true, "Please provide gender"],
      enum: ["Male", "Female", "Other", "Prefer not to say"],
    },
    address: {
      street: { type: String, required: [true, "Please provide street address"] },
      city: { type: String, required: [true, "Please provide city"] },
      country: { type: String, required: [true, "Please provide country"] },
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model exists and delete it to force a schema update (useful in development)
if (mongoose.models && mongoose.models.User) {
  delete mongoose.models.User;
}

export default mongoose.model("User", UserSchema);
