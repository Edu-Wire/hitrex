import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Destination from "@/models/Destination";
import { requireAdmin } from "@/lib/adminAuth";

// GET single destination
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    
    const destination = await Destination.findById(id);
    
    if (!destination) {
      return NextResponse.json(
        { error: "Destination not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ destination }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch destination" },
      { status: 500 }
    );
  }
}

// PUT - Update destination (Admin only)
export async function PUT(request, { params }) {
  try {
    // Temporarily disabled admin check for testing
    // await requireAdmin();
    await connectDB();
    
    const { id } = params;
    const data = await request.json();
    
    const destination = await Destination.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!destination) {
      return NextResponse.json(
        { error: "Destination not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: "Destination updated successfully", destination },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update destination error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update destination" },
      { status: 400 }
    );
  }
}

// DELETE - Delete destination (Admin only)
export async function DELETE(request, { params }) {
  try {
    // Temporarily disabled admin check for testing
    // await requireAdmin();
    await connectDB();
    
    const { id } = params;
    
    const destination = await Destination.findByIdAndDelete(id);
    
    if (!destination) {
      return NextResponse.json(
        { error: "Destination not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: "Destination deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete destination error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete destination" },
      { status: 400 }
    );
  }
}
