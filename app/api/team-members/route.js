import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import TeamMember from "@/models/TeamMember";

export async function GET() {
    await connectDB();
    try {
        const members = await TeamMember.find().sort({ order: 1 });
        return NextResponse.json({ success: true, members });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
