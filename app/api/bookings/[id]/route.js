import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Destination from "@/models/Destination";
import User from "@/models/User";

// GET single booking
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    
    const booking = await Booking.findById(id)
      .populate("destination", "name location image price")
      .populate("user", "name email");
    
    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ booking }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

// PUT - Update booking (Admin only - for status updates)
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const data = await request.json();
    
    const booking = await Booking.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    ).populate("destination", "name location image");
    
    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: "Booking updated successfully", booking },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update booking error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update booking" },
      { status: 400 }
    );
  }
}

// DELETE - Delete booking
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    const booking = await Booking.findByIdAndDelete(id);
    
    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: "Booking deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete booking error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete booking" },
      { status: 400 }
    );
  }
}
