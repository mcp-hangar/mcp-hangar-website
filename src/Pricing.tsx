import {Link} from "react-router-dom";
import {preconnect} from "react-dom";
import {
    GithubIcon,
    ArrowIcon,
    CheckIcon,
    RocketIcon,
} from "./components/Icons";
import {SiteNav} from "./components/SiteNav";
import {LINKS} from "./config";

/* ── tier data ────────────────────────────────────────────── */

interface Tier {
    name: string;
    badge?: string;
    price: string;
    period: string;
    launchBadge?: string;
    description: string;
    cta: string;
    ctaHref: string;
    secondaryCta?: string;
    secondaryCtaHref?: string;
    accent: "emerald" | "sky" | "amber";
    features: string[];
    highlighted?: boolean;
    availability: string;
}

const tiers: Tier[] = [
    {
        name: "OSS Agent v1.0",
        price: "Free",
        period: "forever",
        description: "No cloud account required. Runs fully on your infrastructure.",
        cta: "Install v1.0",
        ctaHref: LINKS.ossQuickstart,
        secondaryCta: "View on GitHub",
        secondaryCtaHref: LINKS.github,
        accent: "emerald",
        availability: "Available now",
        features: [
            "Unlimited MCP providers",
            "Parallel execution & circuit breakers",
            "Provider groups & policy files",
            "Local audit trail",
            "OpenTelemetry traces & Prometheus metrics",
            "Community support (GitHub Issues)",
        ],
    },
    {
        name: "Free Cloud",
        price: "Free",
        period: "forever",
        launchBadge: "June 2026",
        description: "Cloud dashboard for small teams getting started with fleet visibility.",
        cta: "Join Waitlist",
        ctaHref: "/waitlist",
        accent: "sky",
        availability: "Launching June 2026",
        features: [
            "Everything in OSS, plus:",
            "Cloud dashboard (fleet overview)",
            "Up to 2 Hangar instances",
            "7-day event retention",
            "1 team seat",
            "Community support",
        ],
    },
    {
        name: "Pro",
        price: "TBA",
        period: "",
        launchBadge: "September 2026",
        description: "Fleet management, policy governance, and compliance tooling for growing teams.",
        cta: "Join Waitlist",
        ctaHref: "/waitlist?plan=pro",
        accent: "sky",
        highlighted: true,
        availability: "Launching September 2026",
        features: [
            "Everything in Free Cloud, plus:",
            "Unlimited Hangar instances",
            "Extended event retention",
            "Multiple team seats",
            "Policy push to agents in real time",
            "CEF compliance export",
            "SIEM integrations (Splunk, Datadog, Sentinel)",
            "Email support",
        ],
    },
    {
        name: "Enterprise",
        price: "TBA",
        period: "",
        description: "SSO, SLA guarantees, and dedicated support for regulated industries.",
        cta: "Join Waitlist",
        ctaHref: "/waitlist?plan=enterprise",
        accent: "amber",
        availability: "Launching September 2026",
        features: [
            "Everything in Pro, plus:",
            "SSO / SAML / OIDC",
            "Unlimited event retention",
            "Kubernetes operator & CRDs",
            "Behavioral profiling & anomaly detection",
            "NetworkPolicy generation",
            "Uptime SLA",
            "Dedicated support & onboarding",
            "Custom contract & invoicing",
        ],
    },
];

/* ── comparison table ─────────────────────────────────────── */

interface CompRow {
    feature: string;
    oss: string | boolean;
    free: string | boolean;
    pro: string | boolean;
    enterprise: string | boolean;
}

const comparison: CompRow[] = [
    {feature: "MCP providers",          oss: "Unlimited",   free: "Unlimited",  pro: "Unlimited",  enterprise: "Unlimited"},
    {feature: "Hangar instances",       oss: "Self-hosted", free: "2",          pro: "Unlimited",  enterprise: "Unlimited"},
    {feature: "Event retention",        oss: "Local",       free: "7 days",     pro: "Extended",   enterprise: "Unlimited"},
    {feature: "Team seats",             oss: false,         free: "1",          pro: "Multiple",   enterprise: "Unlimited"},
    {feature: "Cloud dashboard",        oss: false,         free: true,         pro: true,         enterprise: true},
    {feature: "Metrics & tracing",      oss: true,          free: true,         pro: true,         enterprise: true},
    {feature: "Local audit trail",      oss: true,          free: true,         pro: true,         enterprise: true},
    {feature: "Policy editor",          oss: false,         free: false,        pro: true,         enterprise: true},
    {feature: "CEF compliance export",  oss: false,         free: false,        pro: true,         enterprise: true},
    {feature: "SIEM integrations",      oss: false,         free: false,        pro: true,         enterprise: true},
    {feature: "SSO / SAML / OIDC",      oss: false,         free: false,        pro: false,        enterprise: true},
    {feature: "Kubernetes operator",    oss: false,         free: false,        pro: false,        enterprise: true},
    {feature: "Behavioral profiling",   oss: false,         free: false,        pro: false,        enterprise: true},
    {feature: "Uptime SLA",             oss: false,         free: false,        pro: false,        enterprise: true},
    {feature: "Support",                oss: "Community",   free: "Community",  pro: "Email",      enterprise: "Dedicated"},
    {feature: "Available",              oss: "Now",         free: "June 2026",  pro: "September 2026",  enterprise: "September 2026"},
];

/* ── helpers ──────────────────────────────────────────────── */

function accentClasses(accent: string, highlighted?: boolean) {
    const map: Record<string, {border: string; bg: string; cta: string; ctaHover: string; badge: string}> = {
        emerald: {
            border: highlighted ? "border-emerald-500/40" : "border-zinc-800/50",
            bg: "bg-emerald-500/5",
            cta: "bg-emerald-500 hover:bg-emerald-400 text-zinc-950",
            ctaHover: "hover:shadow-emerald-500/25",
            badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        },
        sky: {
            border: highlighted ? "border-sky-500/40" : "border-zinc-800/50",
            bg: "bg-sky-500/5",
            cta: "bg-sky-500 hover:bg-sky-400 text-zinc-950",
            ctaHover: "hover:shadow-sky-500/25",
            badge: "bg-sky-500/20 text-sky-400 border-sky-500/30",
        },
        amber: {
            border: highlighted ? "border-amber-500/40" : "border-zinc-800/50",
            bg: "bg-amber-500/5",
            cta: "bg-amber-500 hover:bg-amber-400 text-zinc-950",
            ctaHover: "hover:shadow-amber-500/25",
            badge: "bg-amber-500/20 text-amber-400 border-amber-500/30",
        },
    };
    return map[accent] ?? map.sky;
}

function CellValue({value, accent = "emerald"}: {value: string | boolean; accent?: "emerald" | "sky" | "amber"}) {
    const checkColor = {emerald: "text-emerald-400", sky: "text-sky-400", amber: "text-amber-400"}[accent];
    if (value === true)  return <span className={checkColor}>✓</span>;
    if (value === false) return <span className="text-zinc-600">--</span>;
    return <span className="text-zinc-300">{value}</span>;
}

/* ── component ────────────────────────────────────────────── */

export default function Pricing() {
    preconnect("https://fonts.googleapis.com");
    preconnect("https://fonts.gstatic.com", {crossOrigin: "anonymous"});

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
            {/* Background effects */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/20 via-zinc-950 to-zinc-950"/>
            <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')] opacity-[0.03]"/>

            <div className="relative">
                {/* Nav */}
                <SiteNav activePage="pricing"/>

                {/* Hero */}
                <div className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
                    <h1 className="animate-slide-up text-4xl md:text-6xl font-bold tracking-tight mb-4">
                        Agent v1.0 is here.{" "}
                        <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
                            Cloud is next.
                        </span>
                    </h1>
                    <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                        The mcp-hangar agent is MIT-licensed and production-ready today.
                        Free cloud tier launches in June 2026. Pro and Enterprise follow in September.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 mt-8">
                        <a
                            href={LINKS.ossQuickstart}
                            className="group inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5"
                        >
                            Install v1.0
                            <span className="transition-transform duration-300 group-hover:translate-x-1">
                                <ArrowIcon/>
                            </span>
                        </a>
                        <Link
                            to="/waitlist"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5"
                        >
                            Join Cloud Waitlist
                        </Link>
                    </div>
                </div>

                {/* Tier cards */}
                <div className="max-w-6xl mx-auto px-6 pb-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {tiers.map((tier) => {
                            const a = accentClasses(tier.accent, tier.highlighted);
                            return (
                                <div
                                    key={tier.name}
                                    className={`relative rounded-2xl border ${a.border} ${a.bg} p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                                        tier.highlighted ? "ring-1 ring-sky-500/20" : ""
                                    }`}
                                >
                                    {tier.badge && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${a.badge}`}>
                                                {tier.badge}
                                            </span>
                                        </div>
                                    )}

                                    <div className="mb-auto">
                                        <h3 className="text-xl font-bold text-zinc-100 mb-2">{tier.name}</h3>
                                        <div className="mb-1 flex items-baseline flex-wrap gap-2">
                                            {tier.price === "TBA" ? (
                                                <span className="text-2xl font-bold text-zinc-500">TBA</span>
                                            ) : (
                                                <span className="text-4xl font-bold text-zinc-100">{tier.price}</span>
                                            )}
                                            {tier.price !== "TBA" && tier.price !== "Free" && (
                                                <span className="text-sm text-zinc-500">/ {tier.period}</span>
                                            )}
                                            {tier.launchBadge && (
                                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${a.badge}`}>
                                                    {tier.launchBadge}
                                                </span>
                                            )}
                                        </div>
                                        {tier.price === "Free" && (
                                            <span className="text-sm text-zinc-500 mb-1">{tier.period}</span>
                                        )}
                                        <p className="text-sm text-zinc-400 mb-2">{tier.description}</p>
                                        {!tier.launchBadge && (
                                            <p className="text-xs text-zinc-600">{tier.availability}</p>
                                        )}
                                    </div>

                                    <a
                                        href={tier.ctaHref}
                                        className={`inline-flex items-center justify-center gap-2 px-6 py-3 ${a.cta} font-semibold rounded-lg transition-all duration-300 hover:shadow-lg ${a.ctaHover} hover:-translate-y-0.5 mt-6 ${tier.secondaryCta ? "mb-2" : "mb-6"}`}
                                    >
                                        {tier.cta}
                                        <ArrowIcon/>
                                    </a>
                                    {tier.secondaryCta && tier.secondaryCtaHref && (
                                        <a
                                            href={tier.secondaryCtaHref}
                                            className="inline-flex items-center justify-center gap-1 text-sm text-zinc-400 hover:text-emerald-400 transition-colors mb-6"
                                        >
                                            {tier.secondaryCta} →
                                        </a>
                                    )}

                                    <ul className="space-y-3 flex-1">
                                        {tier.features.map((f, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                                                <span className="text-emerald-400 mt-0.5 shrink-0"><CheckIcon/></span>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Feature comparison table */}
                <div className="max-w-5xl mx-auto px-6 pb-20">
                    <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-6">
                        Feature Comparison
                    </h2>
                    <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl overflow-hidden overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="border-b border-zinc-800/50">
                                <th className="text-left font-semibold text-zinc-300 px-6 py-4 w-1/5">Feature</th>
                                <th className="text-center font-semibold text-emerald-400 px-6 py-4">OSS Agent</th>
                                <th className="text-center font-semibold text-sky-400 px-6 py-4">Free Cloud</th>
                                <th className="text-center font-semibold text-sky-400 px-6 py-4">Pro</th>
                                <th className="text-center font-semibold text-amber-400 px-6 py-4">Enterprise</th>
                            </tr>
                            </thead>
                            <tbody>
                            {comparison.map((row, i) => (
                                <tr key={i} className={`border-b border-zinc-800/30 last:border-b-0 ${row.feature === "Available" ? "bg-zinc-900/40" : ""}`}>
                                    <td className={`px-6 py-3 ${row.feature === "Available" ? "text-zinc-300 font-medium" : "text-zinc-400"}`}>{row.feature}</td>
                                    <td className="px-6 py-3 text-center"><CellValue value={row.oss} accent="emerald"/></td>
                                    <td className="px-6 py-3 text-center"><CellValue value={row.free} accent="sky"/></td>
                                    <td className="px-6 py-3 text-center"><CellValue value={row.pro} accent="sky"/></td>
                                    <td className="px-6 py-3 text-center"><CellValue value={row.enterprise} accent="amber"/></td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Guidance boxes */}
                <div className="max-w-5xl mx-auto px-6 pb-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-5 rounded-xl bg-zinc-900/30 border border-zinc-800/50">
                            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">When OSS is enough</p>
                            <ul className="space-y-1 text-sm text-zinc-400">
                                <li>&#8594; You're running a single deployment</li>
                                <li>&#8594; You don't need team collaboration</li>
                                <li>&#8594; You want full data sovereignty</li>
                                <li>&#8594; You're evaluating before committing</li>
                            </ul>
                        </div>
                        <div className="p-5 rounded-xl bg-zinc-900/30 border border-zinc-800/50">
                            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">When to join Free Cloud waitlist</p>
                            <ul className="space-y-1 text-sm text-zinc-400">
                                <li>&#8594; You want a cloud dashboard for 1-2 instances</li>
                                <li>&#8594; You're a solo developer or small team</li>
                                <li>&#8594; You want basic fleet visibility</li>
                                <li>&#8594; You want to try cloud features at no cost</li>
                            </ul>
                        </div>
                        <div className="p-5 rounded-xl bg-zinc-900/30 border border-zinc-800/50">
                            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">When to join Pro waitlist</p>
                            <ul className="space-y-1 text-sm text-zinc-400">
                                <li>&#8594; You need fleet visibility across many deployments</li>
                                <li>&#8594; Your team needs shared policy management</li>
                                <li>&#8594; You want compliance exports for audits</li>
                                <li>&#8594; You need SIEM integrations</li>
                            </ul>
                        </div>
                        <div className="p-5 rounded-xl bg-zinc-900/30 border border-zinc-800/50">
                            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">When to join Enterprise waitlist</p>
                            <ul className="space-y-1 text-sm text-zinc-400">
                                <li>&#8594; Your org requires SSO / SAML</li>
                                <li>&#8594; You need a signed SLA</li>
                                <li>&#8594; Compliance requires unlimited retention</li>
                                <li>&#8594; You're running MCP at scale across K8s clusters</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* OSS self-host path */}
                <div className="max-w-4xl mx-auto px-6 pb-32">
                    <div className="relative rounded-2xl bg-gradient-to-b from-emerald-500/10 to-transparent border border-emerald-500/20 p-8 md:p-12 overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"/>
                        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-8">
                            <div className="flex-1">
                                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 mb-4">
                                    <RocketIcon/>
                                </div>
                                <h2 className="text-xl font-bold text-zinc-100 mb-2">
                                    The agent is yours. No strings.
                                </h2>
                                <p className="text-zinc-400 text-sm">
                                    <code className="text-emerald-400 bg-zinc-800/50 px-1.5 py-0.5 rounded">mcp-hangar</code> is
                                    MIT-licensed and runs fully standalone — no cloud account, no data leaving your infrastructure.
                                    Parallel execution, circuit breakers, provider groups, observability, and a local audit trail.
                                    The cloud adds fleet management and team features on top — free tier launches June 2026.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 shrink-0">
                                <a
                                    href="/docs/oss/getting-started/quickstart"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
                                >
                                    OSS Agent Docs
                                </a>
                                <a
                                    href="https://github.com/mcp-hangar/mcp-hangar"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
                                >
                                    <GithubIcon/>
                                    View on GitHub
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="border-t border-zinc-800/50">
                    <div className="max-w-6xl mx-auto px-6 py-12">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
                            <span>© 2026 MCP Hangar. Open-source agent under MIT License.</span>
                            <span>
                                <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
                                {" · "}
                                <a href="/docs/" className="hover:text-emerald-400 transition-colors">Docs</a>
                                {" · "}
                                <a href="https://github.com/mcp-hangar/mcp-hangar" className="hover:text-emerald-400 transition-colors">GitHub</a>
                            </span>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}

