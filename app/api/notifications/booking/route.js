import { NextResponse } from "next/server";
import { sendBookingEmail } from "@/lib/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function buildEmailHtml({
  userName,
  userPhone,
  destinationName,
  trekDate,
  totalAmount,
  numberOfPeople,
  specialRequests,
  duration,
  difficulty,
  pricePerPerson,
  manageUrl,
  destinationImage,
}) {
  const safeName = userName || "Traveler";
  const safeDestination = destinationName || "Your Trek";
  const safeImage =
    destinationImage ||
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80";
  const perPerson =
    pricePerPerson ||
    (totalAmount && numberOfPeople ? Math.round(Number(totalAmount) / Number(numberOfPeople)) : undefined);
  const total = totalAmount || 0;
  const phone = userPhone || "Not provided";
  const people = numberOfPeople || 1;
  const trekDuration = duration || "5-7 Days";
  const trekDifficulty = (difficulty || "Challenging").toUpperCase();
  const special = specialRequests || "No special requests noted.";
  const manage = manageUrl || "#";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation</title>
</head>
<body style="margin:0;padding:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background-color:#f7f9fc;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f7f9fc;padding:20px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color:#ffffff;border-radius:15px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.05);">
          <tr>
            <td style="background-color:#00A651;padding:40px 20px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:28px;">Booking Confirmed! ✅</h1>
              <p style="color:#e0f2f1;margin:10px 0 0 0;">Get ready for your ${safeDestination} adventure</p>
            </td>
          </tr>
          <tr>
            <td>
              <img src="${safeImage}" alt="${safeDestination}" style="width:100%;height:auto;display:block;">
            </td>
          </tr>
          <tr>
            <td style="padding:30px;">
              <h2 style="color:#333;margin-top:0;">Hi ${safeName},</h2>
              <p style="color:#666;line-height:1.6;">Your booking has been successfully received. Here are the details for your upcoming trek.</p>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top:20px;border:1px solid #eee;border-radius:10px;">
                <tr>
                  <td style="padding:15px;border-bottom:1px solid #eee;color:#888;">Destination</td>
                  <td style="padding:15px;border-bottom:1px solid #eee;text-align:right;font-weight:bold;">${safeDestination}</td>
                </tr>
                <tr>
                  <td style="padding:15px;border-bottom:1px solid #eee;color:#888;">Trek Date</td>
                  <td style="padding:15px;border-bottom:1px solid #eee;text-align:right;font-weight:bold;">${trekDate || "To be decided"}</td>
                </tr>
                <tr>
                  <td style="padding:15px;border-bottom:1px solid #eee;color:#888;">Phone Number</td>
                  <td style="padding:15px;border-bottom:1px solid #eee;text-align:right;font-weight:bold;">${phone}</td>
                </tr>
                <tr>
                  <td style="padding:15px;border-bottom:1px solid #eee;color:#888;">Number of People</td>
                  <td style="padding:15px;border-bottom:1px solid #eee;text-align:right;font-weight:bold;">${people}</td>
                </tr>
                <tr>
                  <td style="padding:15px;border-bottom:1px solid #eee;color:#888;">Track Duration</td>
                  <td style="padding:15px;border-bottom:1px solid #eee;text-align:right;font-weight:bold;">${trekDuration}</td>
                </tr>
                <tr>
                  <td style="padding:15px;border-bottom:1px solid #eee;color:#888;">Difficulty</td>
                  <td style="padding:15px;border-bottom:1px solid #eee;text-align:right;">
                    <span style="background-color:#fff3e0;color:#ef6c00;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:bold;">${trekDifficulty}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:15px;border-bottom:1px solid #eee;color:#888;">Per Person Cost</td>
                  <td style="padding:15px;border-bottom:1px solid #eee;text-align:right;font-weight:bold;">₹${perPerson || "N/A"}</td>
                </tr>
                <tr>
                  <td style="padding:15px;border-bottom:2px solid #00A651;color:#888;"><strong>Total Investment</strong></td>
                  <td style="padding:15px;border-bottom:2px solid #00A651;text-align:right;font-weight:bold;font-size:18px;color:#00A651;">₹${total}</td>
                </tr>
              </table>
              <div style="margin-top:25px;padding:15px;background-color:#f9f9f9;border-radius:8px;">
                <strong style="color:#333;display:block;margin-bottom:5px;">Special Request:</strong>
                <p style="color:#666;margin:0;font-style:italic;">"${special}"</p>
              </div>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top:30px;">
                <tr>
                  <td align="center">
                    <a href="${manage}" style="background-color:#00A651;color:#ffffff;padding:15px 35px;text-decoration:none;border-radius:30px;font-weight:bold;display:inline-block;">Manage Your Booking</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f1f1f1;padding:20px;text-align:center;">
              <p style="color:#999;font-size:12px;margin:0;">You received this email because you made a booking on our website.</p>
              <p style="color:#999;font-size:12px;margin:5px 0 0 0;">&copy; ${new Date().getFullYear()} Hitrex. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(request) {
  try {
    let body;
    try {
      const text = await request.text();
      body = text ? JSON.parse(text) : {};
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const {
      userEmail,
      userName,
      userPhone,
      destinationName,
      trekDate,
      totalAmount,
      numberOfPeople,
      specialRequests,
      duration,
      difficulty,
      pricePerPerson,
      manageUrl,
      destinationImage,
    } = body || {};

    console.log("Email notification request body:", { userEmail, userName, destinationName });

    if (!userEmail) {
      console.error("Missing userEmail in request");
      return NextResponse.json({ error: "userEmail is required" }, { status: 400 });
    }

    const origin = request.headers.get("origin") || request.nextUrl?.origin || "";
    const html = buildEmailHtml({
      userName,
      userPhone,
      destinationName,
      trekDate,
      totalAmount,
      numberOfPeople,
      specialRequests,
      duration,
      difficulty,
      pricePerPerson,
      manageUrl: manageUrl || (origin ? `${origin}/my-bookings` : undefined),
      destinationImage,
    });

    await sendBookingEmail({
      to: userEmail,
      subject: "Your booking is confirmed",
      html,
      text: `Booking confirmed for ${destinationName || "your trek"} on ${trekDate || "TBD"}. Total: ₹${totalAmount || 0}.`,
    });

    return NextResponse.json({ sent: true }, { status: 200 });
  } catch (error) {
    console.error("Booking email error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send booking email" },
      { status: 500 }
    );
  }
}
