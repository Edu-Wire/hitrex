import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// IMPORTANT: This is a temporary route for creating the first admin
// You should remove or secure this after creating your admin account

export async function POST(request) {
  try {
    const { name, email, password, adminSecret } = await request.json();

    // Add a secret key check for security
    // Change this to a secure secret in production
    if (adminSecret !== "CREATE_ADMIN_SECRET_2025") {
      return NextResponse.json(
        { error: "Invalid admin secret" },
        { status: 403 }
      );
    }

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin", // Set role as admin
    });
    
    return NextResponse.json(
      { 
        message: "Admin user created successfully", 
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Admin registration failed" },
      { status: 400 }
    );
  }
}
