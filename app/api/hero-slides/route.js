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

export async function POST(request) {
    await connectDB();
    try {
        const body = await request.json();
        const { url, location, elevation, order } = body;

        if (!url || !location || !elevation) {
            return NextResponse.json(
                { success: false, error: "URL, location, and elevation are required" },
                { status: 400 }
            );
        }

        const slide = await HeroSlide.create({
            url,
            location,
            elevation,
            order: order || 0
        });

        return NextResponse.json({ success: true, slide });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    await connectDB();
    try {
        const body = await request.json();
        const { id, url, location, elevation, order } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Slide ID is required" },
                { status: 400 }
            );
        }

        const slide = await HeroSlide.findByIdAndUpdate(
            id,
            { url, location, elevation, order },
            { new: true }
        );

        if (!slide) {
            return NextResponse.json(
                { success: false, error: "Slide not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, slide });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    await connectDB();
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Slide ID is required" },
                { status: 400 }
            );
        }

        const slide = await HeroSlide.findByIdAndDelete(id);

        if (!slide) {
            return NextResponse.json(
                { success: false, error: "Slide not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: "Slide deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
