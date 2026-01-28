import mongoose from "mongoose";

const TeamMemberSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        role: { type: String, required: true },
        image: { type: String, required: true },
        bio: { type: String, required: true },
        details: { type: String, required: true },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.models.TeamMember || mongoose.model("TeamMember", TeamMemberSchema);
