import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
// import { requireAdmin } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET all blogs
export async function GET(request) {
  try {
    await connectDB();

    const blogs = await Blog.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      { blogs: Array.isArray(blogs) ? blogs : [] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch blogs", blogs: [] },
      { status: 500 }
    );
  }
}

// POST create blog (admin only)
export async function POST(request) {
  try {
    // await requireAdmin(request);
    await connectDB();

    const data = await request.json();
    const blog = await Blog.create(data);

    return NextResponse.json(
      { message: "Blog created successfully", blog },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create blog error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create blog" },
      { status: 400 }
    );
  }
}
