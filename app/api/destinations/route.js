import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Destination from "@/models/Destination";
import { requireAdmin } from "@/lib/adminAuth";

const FALLBACK_DESTINATIONS = [
  {
    _id: "ebc",
    name: "Everest Base Camp",
    location: "Nepal",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800",
    description: "The ultimate trekking pilgrimage. A high-altitude journey to the foot of the world's tallest peak.",
    difficulty: "Difficult",
    duration: "14 Days",
    price: 2400,
    tags: ["Hiking", "Nepal", "Technical"],
    isActive: true
  },
  {
    _id: "pk",
    name: "Pamir Knot",
    location: "Tajikistan",
    image: "https://images.unsplash.com/photo-1502926535242-4382295d8338?w=800",
    description: "The roof of the world. Remote, rugged, and profoundly beautiful alpine terrain.",
    difficulty: "Challenging",
    duration: "18 Days",
    price: 3200,
    tags: ["Climbing", "Tajikistan", "Remote"],
    isActive: true
  },
  {
    _id: "mb",
    name: "Mont Blanc",
    location: "France",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
    description: "European classic. Traverse three countries around the highest peak in the Alps.",
    difficulty: "Moderate",
    duration: "10 Days",
    price: 1800,
    tags: ["Walking", "France", "Alpine"],
    isActive: true
  },
  {
    _id: "at",
    name: "Ararat",
    location: "Turkey",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
    description: "Climb the legendary peak. A volcanic journey into ancient history and high summits.",
    difficulty: "Challenging",
    duration: "7 Days",
    price: 1500,
    tags: ["Climbing", "Turkey", "Historic"],
    isActive: true
  }
];

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

    let destinations = await Destination.find(query).sort({ createdAt: -1 }).lean();

    if (!destinations || destinations.length === 0) {
      destinations = FALLBACK_DESTINATIONS;
    }

    return NextResponse.json({
      success: true,
      destinations: Array.isArray(destinations) ? destinations : []
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch destinations",
        destinations: []
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
