import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Destination from "@/models/Destination";
import { requireAdmin } from "@/lib/adminAuth";

// GET all destinations
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location");
    const activity = searchParams.get("activity");
    
    let query = { isActive: true };
    
    if (location && location !== "All") {
      query.location = { $regex: location, $options: "i" };
    }
    
    if (activity && activity !== "All") {
      query.tags = activity;
    }
    
    const destinations = await Destination.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ destinations }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch destinations" },
      { status: 500 }
    );
  }
}

// POST - Create new destination (Admin only)
export async function POST(request) {
  try {
    // Temporarily disabled admin check for testing
    // await requireAdmin();
    await connectDB();
    
    const data = await request.json();
    
    const destination = await Destination.create(data);
    
    return NextResponse.json(
      { message: "Destination created successfully", destination },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create destination error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create destination" },
      { status: 400 }
    );
  }
}
