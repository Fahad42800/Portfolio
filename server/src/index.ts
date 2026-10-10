import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";
import { profile, projects } from "./data.js";

const app = express();
const origins = process.env.CLIENT_ORIGIN?.split(",").map((s) => s.trim());
app.use(cors({ origin: origins ?? true }));
app.use(express.json({ limit: "10kb" }));

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.get("/api/profile", (_req, res) => res.json(profile));
app.get("/api/projects", (_req, res) => res.json(projects));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: { error: "Too many messages. Please try again in a few minutes." },
});

const mailer = process.env.SMTP_USER
  ? nodemailer.createTransport({ service: "gmail", auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } })
  : null;

if (mailer) {
  mailer.verify()
    .then(() => console.log("SMTP ready: contact emails will be sent."))
    .catch((e) => console.error("SMTP login FAILED. Use a Gmail App Password in SMTP_PASS:", e.message));
} else if (!process.env.RESEND_API_KEY) {
  console.warn("Email not configured: messages will only be logged.");
}

app.post("/api/contact", limiter, async (req, res) => {
  const { name, email, message, website } = (req.body ?? {}) as Record<string, unknown>;
  if (website) return res.json({ ok: true }); // honeypot: bots fill this hidden field
  const n = typeof name === "string" ? name.trim() : "";
  const e = typeof email === "string" ? email.trim() : "";
  const m = typeof message === "string" ? message.trim() : "";
  if (n.length < 2 || n.length > 80) return res.status(400).json({ error: "Please enter your name." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) || e.length > 120) return res.status(400).json({ error: "Please enter a valid email." });
  if (m.length < 10 || m.length > 2000) return res.status(400).json({ error: "Message must be 10 to 2000 characters." });
  try {
    if (process.env.RESEND_API_KEY) {
      // HTTPS email API: works on hosts that block SMTP (e.g. Render free plan)
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Portfolio <onboarding@resend.dev>",
          to: [process.env.CONTACT_TO ?? profile.email],
          reply_to: e,
          subject: `Portfolio message from ${n}`,
          text: `From: ${n} <${e}>\n\n${m}`,
        }),
      });
      if (!r.ok) throw new Error(await r.text());
    } else if (mailer) {
      await mailer.sendMail({
        from: `"Portfolio" <${process.env.SMTP_USER}>`,
        to: process.env.CONTACT_TO ?? profile.email,
        replyTo: e,
        subject: `Portfolio message from ${n}`,
        text: `From: ${n} <${e}>\n\n${m}`,
      });
    } else {
      console.log(`[contact] ${n} <${e}>: ${m}`);
    }
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not send your message. Please email me directly." });
  }
});

const port = Number(process.env.PORT ?? 5000);
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
