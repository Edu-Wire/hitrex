import mongoose from "mongoose";

const DifficultySchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        color: { type: String, required: true },
        dot: { type: String, required: true },
        text: { type: String, required: true },
        stats: { type: String, required: true },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.models.Difficulty || mongoose.model("Difficulty", DifficultySchema);
