// Vercel Serverless Function — proxies lead submission to LeadProsper
// Keeps lp_key secret server-side; CORS-safe

const LP_CAMPAIGN_ID = "34866";
const LP_SUPPLIER_ID = "114935";
const LP_KEY        = "mw0hjvvqhl136";
const LP_INGEST_URL = "https://api.leadprosper.io/ingest";

export default async function handler(req, res) {
  // CORS headers so the frontend (any origin) can call this
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body || {};

  // Build payload — inject locked credentials, strip empties
  const payload = {
    lp_campaign_id: LP_CAMPAIGN_ID,
    lp_supplier_id: LP_SUPPLIER_ID,
    lp_key:         LP_KEY,
    lp_action:      body.lp_action      || "",
    lp_subid1:      body.lp_subid1      || "",
    lp_subid2:      body.lp_subid2      || "",
    first_name:     body.first_name     || "",
    last_name:      body.last_name      || "",
    email:          body.email          || "",
    phone:          body.phone          || "",
    date_of_birth:  body.date_of_birth  || "",
    gender:         body.gender         || "",
    address:        body.address        || "",
    city:           body.city           || "",
    state:          body.state          || "",
    zip_code:       body.zip_code       || "",
    ip_address:     body.ip_address     || req.headers["x-forwarded-for"] || "",
    user_agent:     body.user_agent     || req.headers["user-agent"] || "",
    landing_page_url:     body.landing_page_url     || "",
    jornaya_leadid:       body.jornaya_leadid       || "",
    trustedform_cert_url: body.trustedform_cert_url || "",
    home_owner:           body.home_owner           || "",
    time_frame:           body.time_frame           || "",
    monthly_electric_bill: body.monthly_electric_bill || "",
    utlity_provider:      body.utlity_provider      || "",
    roof_shade:           body.roof_shade           || "",
    property_type:        body.property_type        || "",
    credit_rating:        body.credit_rating        || "",
    roof_type:            body.roof_type            || "",
  };

  // Remove blank fields
  Object.keys(payload).forEach(k => {
    if (payload[k] === "") delete payload[k];
  });

  // Always keep required creds
  payload.lp_campaign_id = LP_CAMPAIGN_ID;
  payload.lp_supplier_id = LP_SUPPLIER_ID;
  payload.lp_key         = LP_KEY;

  try {
    const lpRes = await fetch(LP_INGEST_URL, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });

    const data = await lpRes.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error("LeadProsper ingest error:", err);
    return res.status(500).json({
      status:  "ERROR",
      message: "Server error contacting LeadProsper: " + err.message,
    });
  }
}
