import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// GET all bookings (Admin gets all, users get their own)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    
    let bookings;
    
    // If admin, get all bookings, otherwise get user's bookings
    if (session.user.role === "admin") {
      bookings = await Booking.find()
        .populate("destination", "name location image")
        .populate("user", "name email")
        .sort({ createdAt: -1 });
    } else {
      bookings = await Booking.find({ userEmail: session.user.email })
        .populate("destination", "name location image")
        .sort({ createdAt: -1 });
    }
    
    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    console.error("Fetch bookings error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// POST - Create new booking
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Please login to make a booking" },
        { status: 401 }
      );
    }

    await connectDB();
    
    const data = await request.json();
    
    const booking = await Booking.create({
      ...data,
      user: session.user.id,
      userEmail: session.user.email,
    });
    
    const populatedBooking = await Booking.findById(booking._id)
      .populate("destination", "name location image");
    
    return NextResponse.json(
      { message: "Booking created successfully", booking: populatedBooking },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create booking error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create booking" },
      { status: 400 }
    );
  }
}
