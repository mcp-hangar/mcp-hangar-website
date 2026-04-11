import {useState, useEffect, type FormEvent} from "react";
import {SiteNav} from "./components/SiteNav";
import {SiteFooter} from "./components/SiteFooter";
import {CheckIcon} from "./components/Icons";

export default function Waitlist() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = "Early Access | mcp-hangar";
    }, []);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");

        if (!email || !email.includes("@")) {
            setError("Enter a valid email address.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/waitlist", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, plan: "free", source: "waitlist-page"}),
            });

            const data: {error?: string} = await res.json();

            if (!res.ok) {
                setError(data.error ?? "Something went wrong. Please try again.");
                return;
            }

            setSubmitted(true);
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
            <SiteNav/>

            <main className="flex-1 flex items-center justify-center px-6 py-24">
                <div className="max-w-md w-full">
                    {submitted ? (
                        <div className="text-center space-y-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 [&_svg]:w-8 [&_svg]:h-8">
                                <CheckIcon/>
                            </div>
                            <h1 className="text-3xl font-bold">You're on the list</h1>
                            <p className="text-zinc-400">
                                We'll reach out to <span className="text-zinc-200">{email}</span> first,
                                before any public announcement.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <h1 className="text-3xl font-bold">
                                    Get early access
                                </h1>
                                <p className="text-zinc-400">
                                    The mcp-hangar agent is available now. Cloud is coming early June.
                                    Leave your email and you'll be the first to know — no date promises, no spam.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
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
                                    className="w-full px-6 py-3 bg-sky-500 hover:bg-sky-400 text-zinc-950 font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                >
                                    {loading ? "Joining..." : "Get notified — Early June"}
                                </button>

                                <p className="text-xs text-zinc-600 text-center">
                                    No spam. One email when we launch.{" "}
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
