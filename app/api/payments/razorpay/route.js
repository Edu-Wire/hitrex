import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

function getClient() {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw new Error("Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET env vars");
  }
  return new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      amount, // in rupees
      currency = "INR",
      receipt = `rcpt_${Date.now()}`,
      notes = {},
    } = body || {};

    const rupees = Number(amount);
    if (!rupees || Number.isNaN(rupees) || rupees <= 0) {
      return NextResponse.json(
        { error: "amount is required and must be > 0 (in rupees)" },
        { status: 400 }
      );
    }

    const client = getClient();
    const order = await client.orders.create({
      amount: Math.round(rupees * 100), // convert to paise
      currency,
      receipt,
      notes,
    });

    return NextResponse.json({ order, key: RAZORPAY_KEY_ID }, { status: 201 });
  } catch (error) {
    console.error("Razorpay order create error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
