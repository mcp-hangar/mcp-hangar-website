import {Link} from "react-router-dom";
import {preconnect} from "react-dom";
import {SiteNav} from "./components/SiteNav";
import {LINKS} from "./config";
import {SEO} from "./components/SEO";

function CheckIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
            <path fillRule="evenodd" d="M13.485 3.515a1 1 0 010 1.414L6.414 12l-3.929-3.929a1 1 0 111.414-1.414L6.414 9.172l5.657-5.657a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
    );
}

interface Tier {
    name: string;
    badge?: string;
    price: React.ReactNode;
    period?: string;
    annualNote?: string;
    launchBadge?: { text: string; colorClass: string };
    description: string;
    cta: string;
    ctaHref: string;
    accent: "emerald" | "blue" | "teal";
    features: string[];
    highlighted?: boolean;
}

const tiers: Tier[] = [
    {
        name: "OSS Agent v1.0",
        price: "Free",
        period: "/forever",
        launchBadge: { text: "Available now", colorClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
        description: "No cloud account required. Runs fully on your infrastructure. MIT licensed.",
        cta: "Install v1.0 →",
        ctaHref: LINKS.ossQuickstart,
        accent: "emerald",
        features: [
            "Unlimited MCP servers",
            "Parallel execution & circuit breakers",
            "MCP server groups & policy files",
            "Local audit trail",
            "OpenTelemetry traces & Prometheus metrics",
            "Community support (GitHub Issues)",
        ],
    },
    {
        name: "Free Cloud",
        price: "Free",
        period: "/forever",
        launchBadge: { text: "June 2026", colorClass: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
        description: "Cloud dashboard for small teams getting started with fleet visibility.",
        cta: "Join Waitlist →",
        ctaHref: "/waitlist",
        accent: "blue",
        features: [
            "Everything in OSS, plus:",
            "Cloud dashboard (fleet overview)",
            "Up to 2 Hangar instances",
            "7-day event retention",
            "1 team seat",
            "100k events/month included",
            "Community support",
        ],
    },
    {
        name: "Pro",
        badge: "Most complete",
        price: (
            <>
                <span className="text-[14px] text-zinc-500 block font-normal leading-tight">From</span>
                $49<small className="text-sm font-normal text-zinc-500">/workspace/mo</small>
            </>
        ),
        annualNote: "$39/mo billed annually (20% off)",
        launchBadge: { text: "September 2026", colorClass: "bg-teal-500/20 text-teal-400 border-teal-500/30" },
        description: "The full platform. Everything the agent measures, governed from the cloud.",
        cta: "Join Waitlist →",
        ctaHref: "/waitlist?plan=pro",
        accent: "teal",
        highlighted: true,
        features: [
            "Everything in Free Cloud, plus:",
            "Unlimited Hangar instances",
            "Event retention up to 90 days",
            "Multiple team seats",
            "Policy push to agents in real time",
            "CEF compliance export",
            "SIEM integrations (Splunk, Datadog, Sentinel)",
            "SSO / SAML / OIDC",
            "Kubernetes operator & CRDs",
            "Behavioral profiling & anomaly detection",
            "10M events/month included, usage-based beyond",
            "Email support",
        ],
    },
];

interface CompRow {
    feature: string;
    oss: string | boolean;
    free: string | boolean;
    pro: string | boolean;
}

const comparison: CompRow[] = [
    {feature: "MCP servers", oss: "Unlimited", free: "Unlimited", pro: "Unlimited"},
    {feature: "Hangar instances", oss: "Self-hosted", free: "2", pro: "Unlimited"},
    {feature: "Event retention", oss: "Local", free: "7 days", pro: "Up to 90 days"},
    {feature: "Events / month included", oss: "Unlimited (local)", free: "100k", pro: "10M + usage"},
    {feature: "Team seats", oss: "–", free: "1", pro: "Multiple"},
    {feature: "Cloud dashboard", oss: "–", free: true, pro: true},
    {feature: "Metrics & tracing", oss: true, free: true, pro: true},
    {feature: "Local audit trail", oss: true, free: true, pro: true},
    {feature: "Policy editor", oss: "–", free: "–", pro: true},
    {feature: "CEF compliance export", oss: "–", free: "–", pro: true},
    {feature: "SIEM integrations", oss: "–", free: "–", pro: true},
    {feature: "SSO / SAML / OIDC", oss: "–", free: "–", pro: true},
    {feature: "Kubernetes operator & CRDs", oss: "–", free: "–", pro: true},
    {feature: "Behavioral profiling & anomaly detection", oss: "–", free: "–", pro: true},
    {feature: "Support", oss: "Community", free: "Community", pro: "Email"},
    {feature: "Available", oss: "Now", free: "June 2026", pro: "September 2026"},
];

function accentClasses(accent: string, highlighted?: boolean) {
    const map: Record<string, {border: string; cta: string; ctaHover: string; listIcon: string; shadow?: string}> = {
        emerald: {
            border: highlighted ? "border-emerald-500" : "border-zinc-800",
            cta: "bg-emerald-500 text-zinc-950",
            ctaHover: "hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]",
            listIcon: "text-emerald-500",
        },
        blue: {
            border: highlighted ? "border-blue-500" : "border-zinc-800",
            cta: "bg-blue-500 text-zinc-950",
            ctaHover: "hover:bg-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]",
            listIcon: "text-blue-500",
        },
        teal: {
            border: highlighted ? "border-teal-500" : "border-zinc-800",
            cta: "bg-teal-500 text-zinc-950",
            ctaHover: "hover:bg-teal-400 hover:shadow-[0_0_15px_rgba(20,184,166,0.3)]",
            listIcon: "text-teal-500",
            shadow: "shadow-[0_0_0_1px_rgba(20,184,166,0.2),_0_24px_60px_-20px_rgba(20,184,166,0.15)]",
        },
    };
    return map[accent] ?? map.emerald;
}

function CellValue({value, accent}: {value: string | boolean; accent: "emerald" | "blue" | "teal"}) {
    const checkColor = {emerald: "text-emerald-500", blue: "text-blue-500", teal: "text-teal-500"}[accent];
    if (value === true)  return <CheckIcon className={checkColor} />;
    return <span className="text-zinc-200">{value}</span>;
}

export default function Pricing() {
    preconnect("https://fonts.googleapis.com");
    preconnect("https://fonts.gstatic.com", {crossOrigin: "anonymous"});

    return (
        <div className="min-h-screen bg-black text-[#e7e7e7] font-sans">
            <SEO 
                title="Plans — MCP Hangar" 
                description="Flexible pricing for the Model Context Protocol governance platform. Choose the right plan for your agents."
                path="/plans"
            />

            <SiteNav activePage="pricing"/>

            <div className="pt-20 pb-16 px-6 text-center max-w-4xl mx-auto">
                <h1 className="text-[clamp(40px,6vw,72px)] font-bold tracking-tight leading-[1.05]">
                    Agent v1.0 is here.<br/>
                    <span className="text-teal-500">Cloud is next.</span>
                </h1>
                <p className="max-w-[640px] mx-auto mt-6 text-[#8a8a8a] text-base">
                    The mcp-hangar agent is MIT-licensed and production-ready today. Free cloud tier launches June 2026. Pro launches September 2026. Enterprise contracts available on request.
                </p>
                <div className="flex gap-3 justify-center mt-9">
                    <a
                        href={LINKS.ossQuickstart}
                        className="inline-block px-5 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 font-medium rounded-md transition-colors"
                    >
                        Install v1.0 →
                    </a>
                    <Link
                        to="/waitlist"
                        className="inline-block px-5 py-2.5 border border-zinc-700 hover:border-zinc-500 text-zinc-100 font-medium rounded-md transition-colors"
                    >
                        Join Cloud Waitlist
                    </Link>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 mb-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {tiers.map((tier) => {
                        const a = accentClasses(tier.accent, tier.highlighted);
                        return (
                            <div
                                key={tier.name}
                                className={`relative bg-[#0a0a0a] border ${a.border} rounded-2xl p-7 ${a.shadow || ""}`}
                            >
                                {tier.badge && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-500 text-black text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                                        {tier.badge}
                                    </div>
                                )}

                                <h3 className="text-lg font-semibold text-zinc-100">{tier.name}</h3>
                                <div className="text-4xl font-bold mt-2">
                                    {tier.price}
                                    {tier.period && <small className="text-xl font-normal text-zinc-500">{tier.period}</small>}
                                </div>
                                {tier.annualNote && (
                                    <div className="text-[13px] text-teal-500 mt-2">{tier.annualNote}</div>
                                )}
                                {tier.launchBadge && (
                                    <span className={`inline-block text-[11px] px-2.5 py-0.5 rounded-full border mt-3 ${tier.launchBadge.colorClass}`}>
                                        {tier.launchBadge.text}
                                    </span>
                                )}
                                <p className="text-[#8a8a8a] text-sm mt-4 min-h-[40px]">{tier.description}</p>
                                
                                <Link
                                    to={tier.ctaHref}
                                    className={`block w-full text-center py-2.5 mt-5 mb-6 rounded-md font-medium transition-all ${a.cta} ${a.ctaHover}`}
                                >
                                    {tier.cta}
                                </Link>

                                <ul className="space-y-3">
                                    {tier.features.map((f, i) => (
                                        <li key={i} className="flex items-start gap-2 text-[14px] text-zinc-300">
                                            <span className={`${a.listIcon} mt-0.5 shrink-0`}>•</span>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-10 bg-gradient-to-br from-amber-500/5 to-amber-500/5 border border-amber-500/20 rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <div>
                        <span className="text-amber-500 text-[11px] font-semibold uppercase tracking-wider mb-2 block">Enterprise</span>
                        <h3 className="text-xl font-semibold text-zinc-100 mb-2">Need paperwork on top of Pro?</h3>
                        <p className="text-[#8a8a8a] text-sm max-w-3xl">
                            Enterprise is the Pro product with contracts around it — signed uptime SLA, custom DPA and MSA, dedicated onboarding, unlimited retention, and annual commitment. No new features, just the paper your compliance team asks for.
                        </p>
                    </div>
                    <a
                        href="mailto:sales@mcp-hangar.io"
                        className="shrink-0 inline-block px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-medium rounded-md transition-colors"
                    >
                        Contact us →
                    </a>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 mb-20">
                <div className="text-xl font-semibold mb-6">Feature Comparison</div>
                <div className="border border-[#1f1f1f] rounded-[14px] overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-[#1f1f1f]">
                                <th className="text-left font-medium text-zinc-400 px-5 py-3.5">Feature</th>
                                <th className="text-left font-medium text-emerald-500 px-5 py-3.5">OSS Agent</th>
                                <th className="text-left font-medium text-blue-500 px-5 py-3.5">Free Cloud</th>
                                <th className="text-left font-medium text-teal-500 px-5 py-3.5">Pro</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparison.map((row, i) => (
                                <tr key={i} className="border-b border-[#1f1f1f] last:border-b-0 hover:bg-[#0a0a0a]">
                                    <td className="px-5 py-3.5 text-zinc-300">{row.feature}</td>
                                    <td className="px-5 py-3.5"><CellValue value={row.oss} accent="emerald"/></td>
                                    <td className="px-5 py-3.5"><CellValue value={row.free} accent="blue"/></td>
                                    <td className="px-5 py-3.5"><CellValue value={row.pro} accent="teal"/></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 mb-20">
                <div className="text-xl font-semibold mb-6">Which Tier Fits</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-[14px] p-6">
                        <div className="text-emerald-500 font-medium mb-4">When OSS is enough</div>
                        <ul className="space-y-2 text-sm text-[#8a8a8a]">
                            <li className="flex gap-2"><span className="text-zinc-600">•</span>You're running a single deployment</li>
                            <li className="flex gap-2"><span className="text-zinc-600">•</span>You don't need team collaboration</li>
                            <li className="flex gap-2"><span className="text-zinc-600">•</span>You want full data sovereignty</li>
                            <li className="flex gap-2"><span className="text-zinc-600">•</span>You're evaluating before committing</li>
                        </ul>
                    </div>
                    <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-[14px] p-6">
                        <div className="text-blue-500 font-medium mb-4">When to join Free Cloud waitlist</div>
                        <ul className="space-y-2 text-sm text-[#8a8a8a]">
                            <li className="flex gap-2"><span className="text-zinc-600">•</span>You want a cloud dashboard for 1-2 instances</li>
                            <li className="flex gap-2"><span className="text-zinc-600">•</span>You're a solo developer or small team</li>
                            <li className="flex gap-2"><span className="text-zinc-600">•</span>You want basic fleet visibility</li>
                            <li className="flex gap-2"><span className="text-zinc-600">•</span>You want to try cloud features at no cost</li>
                        </ul>
                    </div>
                    <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-[14px] p-6">
                        <div className="text-teal-500 font-medium mb-4">When to join Pro waitlist</div>
                        <ul className="space-y-2 text-sm text-[#8a8a8a]">
                            <li className="flex gap-2"><span className="text-zinc-600">•</span>You run MCP at scale across K8s clusters</li>
                            <li className="flex gap-2"><span className="text-zinc-600">•</span>You need behavioral profiling and anomaly detection</li>
                            <li className="flex gap-2"><span className="text-zinc-600">•</span>Compliance requires SIEM shipping and audit exports</li>
                            <li className="flex gap-2"><span className="text-zinc-600">•</span>Your team needs SSO, policy push, and extended retention</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 mb-24">
                <div className="text-xl font-semibold mb-6">Pricing Questions</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-base font-medium text-zinc-100 mb-2">What happens if I go over 10M events/month on Pro?</h4>
                        <p className="text-sm text-[#8a8a8a] leading-relaxed">Usage-based pricing applies to events beyond the included quota. Exact per-million rates will be finalized by GA — early customers get grandfathered pricing locked in at the rate advertised when they signed up.</p>
                    </div>
                    <div>
                        <h4 className="text-base font-medium text-zinc-100 mb-2">Can I move from Free Cloud to Pro without reinstalling?</h4>
                        <p className="text-sm text-[#8a8a8a] leading-relaxed">Yes. Upgrade from inside the dashboard. Your agent keeps running, your event history carries over, policies are preserved.</p>
                    </div>
                    <div>
                        <h4 className="text-base font-medium text-zinc-100 mb-2">Is Pro really everything Enterprise had before?</h4>
                        <p className="text-sm text-[#8a8a8a] leading-relaxed">Yes. Behavioral profiling, K8s operator, SSO, SIEM integrations, compliance export — all in Pro now. Enterprise is about contracts (SLA, DPA, dedicated support), not features.</p>
                    </div>
                    <div>
                        <h4 className="text-base font-medium text-zinc-100 mb-2">What's "From $49"? Are you going to jack up prices later?</h4>
                        <p className="text-sm text-[#8a8a8a] leading-relaxed">The floor stays at $49/workspace/month. The "from" covers usage overage for customers who push past included quotas. Existing Pro customers keep their onboarding rate.</p>
                    </div>
                </div>
            </div>

            <div className="border-t border-[#1f1f1f] bg-[#0a0a0a] py-20 text-center px-6">
                <h3 className="text-2xl font-bold text-zinc-100 mb-3">Start with the agent. Add cloud when you need it.</h3>
                <p className="text-[#8a8a8a] mb-8">The OSS agent is production-grade today. Free Cloud ships in June, Pro in September.</p>
                <div className="flex gap-3 justify-center">
                    <a
                        href={LINKS.ossQuickstart}
                        className="inline-block px-5 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 font-medium rounded-md transition-colors"
                    >
                        Install v1.0 →
                    </a>
                    <Link
                        to="/waitlist"
                        className="inline-block px-5 py-2.5 border border-zinc-700 hover:border-zinc-500 text-zinc-100 font-medium rounded-md transition-colors"
                    >
                        Join Cloud Waitlist
                    </Link>
                </div>
            </div>
            
            <footer className="border-t border-[#1f1f1f] py-10 px-6 text-center text-sm text-zinc-600">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>© 2026 MCP Hangar. Open-source agent under MIT License.</div>
                    <div className="flex gap-4">
                        <Link to="/" className="hover:text-emerald-500 transition-colors">Home</Link>
                        <a href="/docs/" className="hover:text-emerald-500 transition-colors">Docs</a>
                        <a href="https://github.com/mcp-hangar/mcp-hangar" className="hover:text-emerald-500 transition-colors">GitHub</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
