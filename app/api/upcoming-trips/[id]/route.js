import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import UpcomingTrip from "@/models/UpcomingTrips";
// import { requireAdmin } from "@/lib/adminAuth";

// Ensure Node runtime (mongoose not supported on Edge) and no caching
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET single upcoming trip
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const trip = await UpcomingTrip.findById(id);

    if (!trip) {
      return NextResponse.json({ error: "Upcoming trip not found" }, { status: 404 });
    }

    return NextResponse.json({ trip }, { status: 200 });
  } catch (error) {
    console.error("Fetch upcoming trip error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch upcoming trip" },
      { status: 500 }
    );
  }
}

// PUT - Update upcoming trip (Admin only)
export async function PUT(request, { params }) {
  try {
    // Temporarily disabled admin check for testing
    // await requireAdmin(request);
    await connectDB();

    const { id } = params;
    const data = await request.json();

    const trip = await UpcomingTrip.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!trip) {
      return NextResponse.json({ error: "Upcoming trip not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Upcoming trip updated successfully", trip },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update upcoming trip error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update upcoming trip" },
      { status: 400 }
    );
  }
}

// DELETE - Delete upcoming trip (Admin only)
export async function DELETE(request, { params }) {
  try {
    // Temporarily disabled admin check for testing
    // await requireAdmin(request);
    await connectDB();

    const { id } = params;

    const trip = await UpcomingTrip.findByIdAndDelete(id);

    if (!trip) {
      return NextResponse.json({ error: "Upcoming trip not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Upcoming trip deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete upcoming trip error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete upcoming trip" },
      { status: 400 }
    );
  }
}
