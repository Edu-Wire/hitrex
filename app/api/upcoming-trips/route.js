import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import UpcomingTrip from "@/models/UpcomingTrips";
// import { requireAdmin } from "@/lib/adminAuth";

// Ensure Node runtime (mongoose not supported on Edge) and no caching
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET all upcoming trips (optionally limited)
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const parsedLimit = limitParam ? parseInt(limitParam, 10) : null;

    // Debug: verify model shape when issues arise
    if (process.env.NODE_ENV !== "production") {
      console.log("UpcomingTrip model debug:", {
        type: typeof UpcomingTrip,
        keys: Object.keys(UpcomingTrip || {}),
        name: UpcomingTrip?.modelName,
        ctor: UpcomingTrip?.constructor?.name,
      });
    }

    const query = UpcomingTrip.find().sort({ createdAt: -1 });

    if (parsedLimit && !Number.isNaN(parsedLimit)) {
      query.limit(parsedLimit);
    }

    const trips = await query.lean();

    return NextResponse.json(
      { trips: Array.isArray(trips) ? trips : [] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching upcoming trips:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch upcoming trips",
        trips: [],
      },
      { status: 500 }
    );
  }
}


export async function POST(request) {
  try {
   
    await connectDB();

    const data = await request.json();
    const trip = await UpcomingTrip.create(data);

    return NextResponse.json(
      { message: "Upcoming trip created successfully", trip },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create upcoming trip error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create upcoming trip" },
      { status: 400 }
    );
  }
}
