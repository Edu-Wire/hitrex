import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Activity from "@/models/activity";
// import { requireAdmin } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET all activities
export async function GET() {
  try {
    await connectDB();
    const activities = await Activity.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(
      { activities: Array.isArray(activities) ? activities : [] },
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
