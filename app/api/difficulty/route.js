import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import connectDB from "@/lib/mongodb";
import Difficulty from "@/models/Difficulty";

export async function GET() {
    await connectDB();
    try {
        const difficulties = await Difficulty.find().sort({ order: 1 });
        return NextResponse.json({ success: true, difficulties });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
