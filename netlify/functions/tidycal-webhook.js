// netlify/functions/tidycal-webhook.js
//
// Receives TidyCal "booking_created" webhook events.
// If the guest answered "Yes" to the newsletter opt-in question,
// adds them as a free subscriber to The Life Shift Reflections on beehiiv.

const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;
const BEEHIIV_PUB_ID = "pub_3284b86e-f06e-40e3-9721-ec688d175198";

// The TidyCal field key for the newsletter opt-in question
const OPT_IN_FIELD = "question_answer_2";

exports.handler = async (event) => {
  // Only accept POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch {
    console.error("Invalid JSON payload");
    return { statusCode: 400, body: "Bad Request: invalid JSON" };
  }

  // Only process booking_created events
  if (payload.action !== "booking_created") {
    console.log(`Ignoring event type: ${payload.action}`);
    return { statusCode: 200, body: "Ignored: not a booking_created event" };
  }

  const booking = payload.booking || payload;

  // Extract the opt-in answer (case-insensitive match for "yes")
  const optInAnswer = (booking[OPT_IN_FIELD] || "").trim().toLowerCase();
  if (optInAnswer !== "yes") {
    console.log(`Opt-in not selected (value: "${optInAnswer}"). Skipping.`);
    return { statusCode: 200, body: "Skipped: newsletter opt-in not selected" };
  }

  // Extract contact email
  const email = booking.contact_email || booking.email;
  if (!email) {
    console.error("No email found in payload:", JSON.stringify(booking));
    return { statusCode: 400, body: "Bad Request: no email in payload" };
  }

  // Create subscriber in beehiiv
  const beehiivPayload = {
    email,
    tier: "free",
    utm_source: "TidyCal",
    utm_medium: "booking",
    send_welcome_email: true,
    reactivate_existing: false,
  };

  console.log(`Adding subscriber: ${email}`);

  const response = await fetch(
    `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUB_ID}/subscriptions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BEEHIIV_API_KEY}`,
      },
      body: JSON.stringify(beehiivPayload),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    console.error("beehiiv API error:", JSON.stringify(result));
    return {
      statusCode: 502,
      body: `beehiiv error: ${result.message || "unknown error"}`,
    };
  }

  console.log(`Subscriber added successfully: ${email}`);
  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, email }),
  };
};
