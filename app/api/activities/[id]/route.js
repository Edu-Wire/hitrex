import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Activity from "@/models/activity";
// import { requireAdmin } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET single activity
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const activity = await Activity.findById(id);
    if (!activity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }
    return NextResponse.json({ activity }, { status: 200 });
  } catch (error) {
    console.error("Fetch activity error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch activity" },
      { status: 500 }
    );
  }
}

// PUT update activity
export async function PUT(request, { params }) {
  try {
    // await requireAdmin(request);
    await connectDB();
    const { id } = params;
    const data = await request.json();
    const activity = await Activity.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!activity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Activity updated successfully", activity },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update activity error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update activity" },
      { status: 400 }
    );
  }
}

// DELETE activity
export async function DELETE(request, { params }) {
  try {
    // await requireAdmin(request);
    await connectDB();
    const { id } = params;
    const activity = await Activity.findByIdAndDelete(id);
    if (!activity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Activity deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete activity error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete activity" },
      { status: 400 }
    );
  }
}
