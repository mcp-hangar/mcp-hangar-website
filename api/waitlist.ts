import type {VercelRequest, VercelResponse} from "@vercel/node";

const BUTTONDOWN_API_URL = "https://api.buttondown.com/v1/subscribers";
const RESEND_API_URL = "https://api.resend.com/emails";
const VALID_PLANS = new Set(["free", "pro", "enterprise"]);

const WELCOME_EMAIL = {
    subject: "You're on the MCP Hangar waitlist",
    text: `Hey,

You're in. We'll reach out when early access opens.

MCP Hangar is a runtime security and governance layer for MCP servers -- think policy enforcement, audit trails, and fleet management for production agentic workloads. Not another dev tool. Actual Day-2 ops.

What's coming:
- Free tier launches June 9
- Local Kubernetes agent + Hangar Cloud dashboard
- Event-sourced audit log built for SOC2, EU AI Act, HIPAA

In the meantime, if you're deploying MCP servers in production and running into governance problems -- hit reply. I read everything.

-- Marcin
Founder, MCP Hangar
mcp-hangar.io`,
};

/** Rate limit: simple in-memory counter per IP (resets on cold start). */
const ipCounts = new Map<string, {count: number; resetAt: number}>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = ipCounts.get(ip);
    if (!entry || now > entry.resetAt) {
        ipCounts.set(ip, {count: 1, resetAt: now + RATE_WINDOW_MS});
        return false;
    }
    entry.count++;
    return entry.count > RATE_LIMIT;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS preflight
    if (req.method === "OPTIONS") {
        res.setHeader("Access-Control-Allow-Origin", "https://mcp-hangar.io");
        res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        return res.status(204).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({error: "Method not allowed"});
    }

    const apiKey = process.env.BUTTONDOWN_API_KEY;
    const resendKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.error("BUTTONDOWN_API_KEY is not configured");
        return res.status(500).json({error: "Service misconfigured"});
    }

    // Rate limit by IP
    const ip =
        (Array.isArray(req.headers["x-forwarded-for"])
            ? req.headers["x-forwarded-for"][0]
            : req.headers["x-forwarded-for"]?.split(",")[0]?.trim()) ||
        req.socket?.remoteAddress ||
        "unknown";

    if (isRateLimited(ip)) {
        return res.status(429).json({error: "Too many requests. Try again later."});
    }

    // Parse and validate input
    const {email, plan} = req.body || {};

    if (!email || typeof email !== "string") {
        return res.status(400).json({error: "Email is required."});
    }

    const emailTrimmed = email.trim().toLowerCase();
    if (emailTrimmed.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
        return res.status(400).json({error: "Invalid email address."});
    }

    const planValue = typeof plan === "string" && VALID_PLANS.has(plan) ? plan : "free";

    // Call Buttondown API
    try {
        const response = await fetch(BUTTONDOWN_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Token ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email_address: emailTrimmed,
                tags: [`waitlist-${planValue}`],
                metadata: {
                    plan: planValue,
                    source: "website",
                    signup_date: new Date().toISOString(),
                },
                ip_address: ip !== "unknown" ? ip : undefined,
            }),
        });

        if (response.status === 201) {
            // New subscriber -- send welcome email via Resend
            if (resendKey) {
                try {
                    await fetch(RESEND_API_URL, {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${resendKey}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            from: "Marcin from MCP Hangar <marcin.pyrka@mcp-hangar.io>",
                            to: [emailTrimmed],
                            reply_to: "marcin.pyrka@mcp-hangar.io",
                            subject: WELCOME_EMAIL.subject,
                            text: WELCOME_EMAIL.text,
                        }),
                    });
                } catch (emailErr) {
                    // Log but don't fail the signup if email fails
                    console.error("Resend welcome email failed:", emailErr);
                }
            }
            return res.status(200).json({ok: true});
        }

        if (response.status === 409) {
            // Already subscribed -- treat as success
            return res.status(200).json({ok: true, existing: true});
        }

        if (response.status === 429) {
            return res.status(429).json({error: "Too many requests. Try again later."});
        }

        const body = await response.text();
        console.error(`Buttondown error: ${response.status} ${body}`);
        return res.status(502).json({error: "Failed to register. Please try again."});
    } catch (err) {
        console.error("Buttondown request failed:", err);
        return res.status(502).json({error: "Failed to register. Please try again."});
    }
}
