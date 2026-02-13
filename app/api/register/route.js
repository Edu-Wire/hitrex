import { NextResponse } from "next/server";
import { registerUser } from "@/lib/auth";

export async function POST(request) {
  try {
    const userData = await request.json();
    const { firstName, surname, gender, address, email, password } = userData;

    if (!firstName || !surname || !gender || !address || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!address.street || !address.city || !address.country) {
      return NextResponse.json(
        { error: "Complete address is required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const user = await registerUser(userData);

    return NextResponse.json(
      { message: "User registered successfully", user },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Registration failed" },
      { status: 400 }
    );
  }
}
