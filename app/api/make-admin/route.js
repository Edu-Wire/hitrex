import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// Temporary route to make existing user an admin
export async function POST(request) {
  try {
    const { email, adminSecret } = await request.json();

    // Security check
    if (adminSecret !== "MAKE_ADMIN_SECRET_2025") {
      return NextResponse.json(
        { error: "Invalid admin secret" },
        { status: 403 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update user role to admin
    user.role = "admin";
    await user.save();
    
    return NextResponse.json(
      { 
        message: "User promoted to admin successfully", 
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to make admin" },
      { status: 400 }
    );
  }
}
