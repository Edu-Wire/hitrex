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
    const adminParam = searchParams.get("admin");
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

    // Fetch all trips and filter in JS for better handling of date range strings
    const trips = await UpcomingTrip.find().sort({ createdAt: -1 }).lean();

    // Helper function to parse date string (handles "Oct 15 - 19, 2025")
    const parseTripDate = (dateStr) => {
      if (!dateStr) return null;
      try {
        // Handle "Month DD - DD, YYYY" format by taking the first date
        const cleanDate = dateStr.replace(/ - \d+,/, ",");
        const date = new Date(cleanDate);
        return isNaN(date.getTime()) ? null : date;
      } catch {
        return null;
      }
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentTrips = [];
    let completedTrips = [];

    trips.forEach(trip => {
      const tripDate = parseTripDate(trip.date);
      if (!tripDate || tripDate >= today) {
        currentTrips.push(trip);
      } else {
        completedTrips.push(trip);
      }
    });

    if (parsedLimit && !Number.isNaN(parsedLimit)) {
      currentTrips = currentTrips.slice(0, parsedLimit);
    }

    // Only return completedTrips for admin view
    if (!adminParam) {
      completedTrips = [];
    }


    return NextResponse.json(
      {
        trips: Array.isArray(currentTrips) ? currentTrips : [],
        completedTrips: Array.isArray(completedTrips) ? completedTrips : [],
        totalCount: trips.length
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching upcoming trips:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch upcoming trips",
        trips: [],
        completedTrips: [],
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
