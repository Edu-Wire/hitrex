import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Insight from "@/models/Insight";

export async function GET() {
    await connectDB();
    try {
        const insights = await Insight.find().sort({ order: 1 });
        return NextResponse.json({ success: true, insights });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
