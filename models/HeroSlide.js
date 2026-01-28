import mongoose from "mongoose";

const HeroSlideSchema = new mongoose.Schema(
    {
        url: { type: String, required: true },
        location: { type: String, required: true },
        elevation: { type: String, required: true },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.models.HeroSlide || mongoose.model("HeroSlide", HeroSlideSchema);
