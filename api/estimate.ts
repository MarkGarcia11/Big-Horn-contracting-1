import { createHash, randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

type EstimateBody = {
  name?: unknown; phone?: unknown; email?: unknown; service?: unknown; details?: unknown;
  contactMethod?: unknown; partnerName?: unknown; website?: unknown; photoData?: unknown;
  elapsedMs?: unknown; sourcePath?: unknown; language?: unknown;
};

const serviceNames: Record<string, string> = {
  concrete: "Concrete", block: "Block / CMU", stucco: "Stucco", remodeling: "Interior Remodeling",
  "cleanup-hauling": "Cleanup & Hauling", general: "Not sure yet", "": "Not selected",
};

function json(message: Record<string, unknown>, status: number) {
  return Response.json(message, { status, headers: { "Cache-Control": "no-store" } });
}

function string(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength + 1) : "";
}

function validImage(data: string): { contentType: string; bytes: Buffer; extension: string } | null {
  const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(data);
  if (!match) return null;
  const bytes = Buffer.from(match[2], "base64");
  if (bytes.length < 8 || bytes.length > 2 * 1024 * 1024) return null;
  const type = match[1];
  const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const png = bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const webp = bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
  if (!((type === "image/jpeg" && jpeg) || (type === "image/png" && png) || (type === "image/webp" && webp))) return null;
  return { contentType: type, bytes, extension: type === "image/jpeg" ? "jpg" : type.split("/")[1] };
}

export async function POST(request: Request) {
  const env = process.env;
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY || !env.RATE_LIMIT_SALT || !env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL || !env.OWNER_EMAIL) {
    return json({ error: "Estimate service is not configured" }, 503);
  }

  const origin = request.headers.get("origin");
  if (origin) {
    try { if (new URL(origin).host !== new URL(request.url).host) return json({ error: "Origin not allowed" }, 403); }
    catch { return json({ error: "Invalid origin" }, 403); }
  }
  const size = Number(request.headers.get("content-length") || 0);
  if (size > 3_800_000) return json({ error: "Request too large" }, 413);

  let body: EstimateBody;
  try { body = await request.json() as EstimateBody; }
  catch { return json({ error: "Invalid JSON" }, 400); }
  if (!body || typeof body !== "object") return json({ error: "Invalid request" }, 400);
  if (string(body.website, 200)) return json({ ok: true }, 200); // Honeypot: acknowledge bots without storing a lead.
  if (typeof body.elapsedMs !== "number" || body.elapsedMs < 2500) return json({ error: "Please try again" }, 400);

  const name = string(body.name, 100);
  const phone = string(body.phone, 30);
  const email = string(body.email, 150);
  const service = string(body.service, 40);
  const details = string(body.details, 3000);
  const contactMethod = string(body.contactMethod, 10);
  const partnerName = string(body.partnerName, 100);
  const sourcePath = string(body.sourcePath, 200);
  const language = body.language === "es" ? "es" : "en";
  if (name.length < 2 || name.length > 100 || phone.replace(/\D/g, "").length < 10 || phone.replace(/\D/g, "").length > 16 || details.length < 8 || details.length > 3000) return json({ error: "Missing or invalid project details" }, 400);
  if (!Object.prototype.hasOwnProperty.call(serviceNames, service) || !["call", "text", "email"].includes(contactMethod)) return json({ error: "Invalid service or contact method" }, 400);
  if ((email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) || (contactMethod === "email" && !email)) return json({ error: "Invalid email" }, 400);
  if (partnerName.length > 100) return json({ error: "Invalid partner name" }, 400);

  const photo = typeof body.photoData === "string" ? validImage(body.photoData) : null;
  if (body.photoData && !photo) return json({ error: "Invalid photo" }, 400);
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
  const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  const ipHash = createHash("sha256").update(`${env.RATE_LIMIT_SALT}:${ip}`).digest("hex");

  try {
    // The database function serializes checks per IP hash, so limits hold across serverless instances.
    const { data: allowed, error: rateError } = await supabase.rpc("consume_estimate_rate_limit", { p_ip_hash: ipHash });
    if (rateError) throw rateError;
    if (!allowed) return json({ error: "Rate limit exceeded" }, 429);

    let photoPath: string | null = null;
    if (photo) {
      photoPath = `${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${photo.extension}`;
      const { error: photoError } = await supabase.storage.from("estimate-photos").upload(photoPath, photo.bytes, { contentType: photo.contentType, upsert: false });
      if (photoError) throw photoError;
    }

    const { data: lead, error: insertError } = await supabase.from("estimate_requests").insert({
      name, phone, email: email || null, service: service || "general", details,
      contact_method: contactMethod, partner_name: partnerName || null,
      photo_path: photoPath, source_path: sourcePath.startsWith("/") ? sourcePath : "/", language,
      notification_status: "pending",
    }).select("id").single();
    if (insertError) {
      if (photoPath) await supabase.storage.from("estimate-photos").remove([photoPath]);
      throw insertError;
    }

    const emailText = [
      "New Big Horn estimate request", "", `Name: ${name}`, `Phone: ${phone}`, `Email: ${email || "Not provided"}`,
      `Service: ${serviceNames[service]}`, `Preferred contact: ${contactMethod}`,
      `Decision partner: ${partnerName || "Not provided"}`, `Language: ${language}`,
      `Source: ${sourcePath || "/"}`, `Photo: ${photoPath ? `Private storage: ${photoPath}` : "None"}`,
      "", "Project details:", details,
    ].join("\n");
    let notificationStatus = "failed";
    try {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: env.RESEND_FROM_EMAIL, to: [env.OWNER_EMAIL], subject: `New estimate request: ${serviceNames[service]}`, text: emailText, reply_to: email || undefined }),
      });
      if (emailResponse.ok) notificationStatus = "sent";
      else console.error("Estimate saved, email notification failed", emailResponse.status, await emailResponse.text());
    } catch (emailError) {
      console.error("Estimate saved, email notification unavailable", emailError);
    }
    const { error: statusError } = await supabase.from("estimate_requests").update({ notification_status: notificationStatus }).eq("id", lead.id);
    if (statusError) console.error("Could not update notification status", statusError);
    return json({ ok: true }, 200);
  } catch (error) {
    console.error("Estimate submission failed", error);
    return json({ error: "Submission unavailable" }, 500);
  }
}

export function GET() { return json({ error: "Method not allowed" }, 405); }