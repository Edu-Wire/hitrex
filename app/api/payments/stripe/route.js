import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const { STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY } = process.env;
let stripe = null;

function getStripeClient() {
  if (stripe) return stripe;
  if (!STRIPE_SECRET_KEY) {
    throw new Error("Missing STRIPE_SECRET_KEY env var");
  }

  stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });
  return stripe;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      amount, // rupees
      currency = "inr",
      metadata = {},
      customerEmail,
      successPath = "/my-bookings",
      cancelPath,
      productName = "Booking payment",
    } = body || {};

    const rupees = Number(amount);
    if (!rupees || Number.isNaN(rupees) || rupees <= 0) {
      return NextResponse.json(
        { error: "amount is required and must be > 0 (in rupees)" },
        { status: 400 }
      );
    }

    const stripeClient = getStripeClient();
    const origin = request.headers.get("origin") || request.nextUrl.origin;
    const cancelUrl =
      cancelPath && cancelPath.startsWith("http")
        ? cancelPath
        : `${origin}${cancelPath || request.nextUrl.pathname}`;

    const session = await stripeClient.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: productName,
            },
            unit_amount: Math.round(rupees * 100), // paise
          },
          quantity: 1,
        },
      ],
      metadata,
      customer_email: customerEmail,
      success_url: `${origin}${successPath}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
    });

    return NextResponse.json(
      {
        checkoutUrl: session.url,
        sessionId: session.id,
        publishableKey: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Stripe checkout session error:", error);
    return NextResponse.json(
      {
        error:
          error?.raw?.message ||
          error?.message ||
          "Failed to create Stripe checkout session",
      },
      { status: 500 }
    );
  }
}
