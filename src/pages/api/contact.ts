import type { APIRoute } from "astro";
import nodemailer from "nodemailer";

// Rate limiting store (in-memory, per server instance)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5; // max requests
const RATE_LIMIT_WINDOW = 60_000; // per 60 seconds

// Create transporter lazily so process.env is read at runtime (not build time)
let _transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!_transporter) {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      throw new Error(
        `Missing SMTP configuration. SMTP_HOST=${host ? "set" : "missing"}, SMTP_USER=${user ? "set" : "missing"}, SMTP_PASS=${pass ? "set" : "missing"}`,
      );
    }

    _transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: { user, pass },
    });
  }
  return _transporter;
}

const getContactTo = () =>
  process.env.CONTACT_TO_EMAIL || "carlosandresbeltran89@gmail.com";
const getContactFrom = () =>
  process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// Sanitize input to prevent XSS
function sanitize(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

const securityHeaders = {
  "Content-Type": "application/json",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    // Rate limiting
    const ip = clientAddress || "unknown";
    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { status: 429, headers: securityHeaders },
      );
    }

    // Validate Content-Type
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return new Response(JSON.stringify({ error: "Invalid content type" }), {
        status: 415,
        headers: securityHeaders,
      });
    }

    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400, headers: securityHeaders },
      );
    }

    // Validate field lengths
    if (
      name.length > 100 ||
      subject.length > 200 ||
      message.length > 5000 ||
      email.length > 254
    ) {
      return new Response(
        JSON.stringify({ error: "Field length exceeds maximum allowed" }),
        { status: 400, headers: securityHeaders },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email format" }), {
        status: 400,
        headers: securityHeaders,
      });
    }

    // Sanitize inputs
    const safeName = sanitize(name);
    const safeEmail = sanitize(email);
    const safeSubject = sanitize(subject);
    const safeMessage = sanitize(message);

    // Send email via SMTP
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"Portafolio - ${safeName}" <${getContactFrom()}>`,
      to: getContactTo(),
      replyTo: safeEmail,
      subject: `[Portafolio] ${safeSubject}`,
      text: `Nombre: ${safeName}\nEmail: ${safeEmail}\n\n${safeMessage}`,
      html: `
        <h2>Nuevo mensaje desde tu portafolio</h2>
        <p><strong>Nombre:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Asunto:</strong> ${safeSubject}</p>
        <hr />
        <p>${safeMessage.replace(/\n/g, "<br />")}</p>
      `,
    });

    console.log(
      `Contact email sent from ${safeEmail} - Subject: ${safeSubject}`,
    );

    return new Response(
      JSON.stringify({ success: true, message: "Message received" }),
      { status: 200, headers: securityHeaders },
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: securityHeaders,
    });
  }
};
