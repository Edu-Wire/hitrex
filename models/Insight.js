import mongoose from "mongoose";

const InsightSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        iconName: { type: String, required: true },
        color: { type: String, required: true },
        text: { type: String, required: true },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.models.Insight || mongoose.model("Insight", InsightSchema);
