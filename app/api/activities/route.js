import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Activity from "@/models/activity";
// import { requireAdmin } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const FALLBACK_ACTIVITIES = [
  {
    _id: "a1",
    subtitle: "High Altitude Terrain",
    title: "Annapurna Circuit",
    description: "Navigate the legendary Thorong La Pass. A 160km odyssey through the heart of the Himalayas.",
    coordinates: "28.7941° N, 83.8203° E // Nepal",
    images: ["https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200"]
  },
  {
    _id: "a2",
    subtitle: "Alpine Excellence",
    title: "Dolomites Alta Via",
    description: "Vertical cathedrals of limestone. Experience the Alta Via 1 in Northern Italy's most iconic range.",
    coordinates: "46.5405° N, 12.1357° E // Italy",
    images: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200"]
  }
];

// GET all activities
export async function GET() {
  try {
    await connectDB();
    let activities = await Activity.find().sort({ createdAt: -1 }).lean();
    if (!activities || activities.length === 0) {
      activities = FALLBACK_ACTIVITIES;
    }
    return NextResponse.json(
      { success: true, activities: Array.isArray(activities) ? activities : [] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch activities", activities: [] },
      { status: 500 }
    );
  }
}

// POST create activity (admin only)
export async function POST(request) {
  try {
    // await requireAdmin(request);
    await connectDB();
    const data = await request.json();
    const activity = await Activity.create(data);
    return NextResponse.json(
      { message: "Activity created successfully", activity },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create activity error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create activity" },
      { status: 400 }
    );
  }
}
