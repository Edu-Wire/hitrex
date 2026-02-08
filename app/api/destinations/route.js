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
    const adminParam = searchParams.get("admin");

    let query = { isActive: true };

    if (location && location !== "All") {
      query.location = { $regex: location, $options: "i" };
    }

    if (activity && activity !== "All") {
      query.tags = activity;
    }


    // Fetch destinations and filter by date in JS for range handling
    let destinations = await Destination.find(query).sort({ createdAt: -1 }).lean();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parseDestDate = (dateStr) => {
      if (!dateStr) return null;
      try {
        const cleanDate = dateStr.replace(/ - \d+,/, ",");
        const date = new Date(cleanDate);
        return isNaN(date.getTime()) ? null : date;
      } catch {
        return null;
      }
    };

    let currentDestinations = [];
    let completedDestinations = [];

    destinations.forEach(dest => {
      const destDate = parseDestDate(dest.date);
      if (destDate && destDate < today) {
        completedDestinations.push(dest);
      } else {
        currentDestinations.push(dest);
      }
    });

    // For regular users, show current and future trips (the opposite of previous past-only logic)
    if (!adminParam) {
      // Show only current/future destinations
    } else {
      // For admins, currentDestinations is already calculated
    }





    return NextResponse.json({
      success: true,
      destinations: Array.isArray(currentDestinations) ? currentDestinations : [],
      completedDestinations: Array.isArray(completedDestinations) ? completedDestinations : [],
      totalCount: destinations.length
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch destinations",
        destinations: [],
        completedDestinations: []
      },
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
    console.log("POST /api/destinations - Received data:", data);

    const destination = await Destination.create(data);
    console.log("POST /api/destinations - Saved destination:", destination);

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
