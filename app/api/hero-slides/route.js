import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import HeroSlide from "@/models/HeroSlide";

export async function GET() {
    await connectDB();
    try {
        const slides = await HeroSlide.find().sort({ order: 1 });
        return NextResponse.json({ success: true, slides });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
