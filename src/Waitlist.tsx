import {useState, useEffect, type FormEvent} from "react";
import {useSearchParams} from "react-router-dom";
import {SiteNav} from "./components/SiteNav";
import {SiteFooter} from "./components/SiteFooter";
import {CheckIcon} from "./components/Icons";

type Plan = "free" | "pro" | "enterprise";

const PLAN_LABELS: Record<Plan, string> = {
    free: "Free Cloud",
    pro: "Pro",
    enterprise: "Enterprise",
};

const PLAN_DETAILS: Record<Plan, {launch: string; perks: string[]}> = {
    free: {
        launch: "June 2026",
        perks: [
            "Cloud dashboard for up to 2 Hangar instances",
            "7-day event retention",
            "1 team seat",
            "Community support",
        ],
    },
    pro: {
        launch: "September 2026",
        perks: [
            "Unlimited Hangar instances",
            "Extended event retention",
            "Multiple team seats",
            "Policy push, CEF export, SIEM integrations",
        ],
    },
    enterprise: {
        launch: "September 2026",
        perks: [
            "SSO / SAML / OIDC",
            "Unlimited event retention",
            "Kubernetes operator & CRDs",
            "99.9% uptime SLA",
            "Dedicated support & onboarding",
        ],
    },
};

export default function Waitlist() {
    const [searchParams] = useSearchParams();
    const paramPlan = searchParams.get("plan");
    const initialPlan: Plan = paramPlan === "pro" || paramPlan === "enterprise" ? paramPlan : "free";

    const [plan, setPlan] = useState<Plan>(initialPlan);
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = "Join the Waitlist | mcp-hangar";
    }, []);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");

        if (!email || !email.includes("@")) {
            setError("Please enter a valid email address.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/waitlist", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, plan}),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Something went wrong. Please try again.");
                return;
            }

            setSubmitted(true);
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const details = PLAN_DETAILS[plan];

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
            <SiteNav/>

            <main className="flex-1 flex items-center justify-center px-6 py-24">
                <div className="max-w-lg w-full">
                    {submitted ? (
                        <div className="text-center space-y-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 [&_svg]:w-8 [&_svg]:h-8">
                                <CheckIcon/>
                            </div>
                            <h1 className="text-3xl font-bold">You're on the list</h1>
                            <p className="text-zinc-400">
                                We'll notify <span className="text-zinc-200">{email}</span> when
                                the <span className="text-zinc-200">{PLAN_LABELS[plan]}</span> tier
                                is ready ({details.launch}).
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="text-center space-y-3">
                                <h1 className="text-3xl font-bold">
                                    Join the Cloud Waitlist
                                </h1>
                                <p className="text-zinc-400">
                                    The mcp-hangar agent is available now as v1.0.
                                    Sign up to get early access when the cloud platform launches.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Plan selector */}
                                <fieldset className="space-y-3">
                                    <legend className="text-sm font-medium text-zinc-300">
                                        Choose your plan
                                    </legend>
                                    <div className="grid grid-cols-3 gap-3">
                                        {(Object.keys(PLAN_LABELS) as Plan[]).map((p) => (
                                            <button
                                                key={p}
                                                type="button"
                                                onClick={() => setPlan(p)}
                                                className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                                                    plan === p
                                                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                                                        : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500"
                                                }`}
                                            >
                                                {PLAN_LABELS[p]}
                                            </button>
                                        ))}
                                    </div>
                                </fieldset>

                                {/* Plan perks */}
                                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-2">
                                    <p className="text-xs text-zinc-500 uppercase tracking-wide">
                                        {PLAN_LABELS[plan]} &mdash; launching {details.launch}
                                    </p>
                                    <ul className="space-y-1.5">
                                        {details.perks.map((perk) => (
                                            <li key={perk} className="flex items-start gap-2 text-sm text-zinc-300">
                                                <span className="text-emerald-400 mt-0.5 shrink-0">
                                                    <CheckIcon/>
                                                </span>
                                                {perk}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-zinc-300">
                                        Work email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@company.com"
                                        className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                                    />
                                    {error && (
                                        <p className="text-sm text-red-400">{error}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                >
                                    {loading ? "Joining..." : "Join Waitlist"}
                                </button>

                                <p className="text-xs text-zinc-600 text-center">
                                    No spam. We'll only email you when your tier launches.
                                    By signing up you agree to our{" "}
                                    <a href="/privacy" className="text-zinc-500 hover:text-emerald-400 underline">Privacy Policy</a>.
                                </p>
                            </form>
                        </div>
                    )}
                </div>
            </main>

            <SiteFooter/>
        </div>
    );
}
