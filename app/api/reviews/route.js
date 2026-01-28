import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const FALLBACK_REVIEWS = [
  {
    _id: "r1",
    name: "Alex Thompson",
    rating: 5,
    comment: "The Annapurna Circuit was life-changing. Hitrex team handled everything with extreme professionalism. Highly recommended for technical treks!",
    createdAt: new Date()
  },
  {
    _id: "r2",
    name: "Sarah Jenkins",
    rating: 5,
    comment: "Mont Blanc was stunning. The guides were incredibly knowledgeable about the terrain. Can't wait for my next deployment with them.",
    createdAt: new Date()
  },
  {
    _id: "r3",
    name: "Marcus Rossi",
    rating: 4,
    comment: "Excellent gear and support. The Pamir Knot is no joke, but felt safe the entire time.",
    createdAt: new Date()
  }
];

export async function GET() {

  try {
    await connectDB();
    let reviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    if (!reviews || reviews.length === 0) {
      reviews = FALLBACK_REVIEWS;
    }

    return NextResponse.json({ success: true, reviews }, { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews", reviews: [] },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: please login" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const rating = Number(body?.rating);
    const comment = (body?.comment || "").toString().trim();
    const wordCount = comment ? comment.split(/\s+/).filter(Boolean).length : 0;

    if (!rating || rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    if (!comment || comment.length < 8) {
      throw new Error("Comment must be at least 8 characters");
    }

    if (wordCount > 100) {
      throw new Error("Comment must be 100 words or fewer");
    }

    await connectDB();

    const review = await Review.create({
      user: session.user.id,
      name: session.user.name || session.user.email,
      rating,
      comment,
    });

    return NextResponse.json(
      { message: "Review created", review },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating review:", error);
    const status = error.message?.includes("Unauthorized") ? 401 : 400;
    return NextResponse.json(
      { error: error.message || "Failed to create review" },
      { status }
    );
  }
}
